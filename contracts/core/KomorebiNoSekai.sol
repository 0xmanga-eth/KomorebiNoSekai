// SPDX-License-Identifier: Apache-2.0
// Source code heavily inspired from deployed contract instance of Azuki collection
// https://etherscan.io/address/0xed5af388653567af2f388e6224dc7c4b3241c544#code
// The source code in the github does not have some important features.
// This is why we used directly the code from the deployed version.
pragma solidity >=0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";

import "hardhat/console.sol";

/// @title KomorebiNoSekai
/// @author 0xmanga
contract KomorebiNoSekai is Ownable, ERC721A, ReentrancyGuard {
    uint256 public immutable maxPerAddressDuringMint;
    uint256 public immutable amountForDevs;

    struct SaleConfig {
        uint32 whitelistSaleStartTime;
        uint32 saleStartTime;
        uint64 mintlistPrice;
        uint64 price;
    }

    SaleConfig public saleConfig;

    mapping(address => uint8) public _allowList;

    constructor(
        uint256 maxBatchSize_,
        uint256 collectionSize_,
        uint256 amountForDevs_
    ) ERC721A("Komorebi No Sekai", "KNS", maxBatchSize_, collectionSize_) {
        maxPerAddressDuringMint = maxBatchSize_;
        amountForDevs = amountForDevs_;
    }

    function allowlistMint() external payable callerIsUser {
        uint256 price = uint256(saleConfig.mintlistPrice);
        uint256 whitelistSaleStartTime = uint256(saleConfig.whitelistSaleStartTime);

        require(getCurrentTime() >= whitelistSaleStartTime, "allowlist sale has not begun yet");
        require(price != 0, "allowlist sale has not begun yet");
        require(_allowList[msg.sender] > 0, "not eligible for allowlist mint");
        require(totalSupply() + 1 <= collectionSize, "reached max supply");
        _allowList[msg.sender]--;
        _safeMint(msg.sender, 1);
        refundIfOver(price);
    }

    function saleMint(uint256 quantity) external payable callerIsUser {
        SaleConfig memory config = saleConfig;
        uint256 price = uint256(config.price);
        uint256 saleStartTime = uint256(config.saleStartTime);

        require(isPublicSaleOn(price, saleStartTime), "public sale has not begun yet");
        require(totalSupply() + quantity <= collectionSize, "reached max supply");
        require(numberMinted(msg.sender) + quantity <= maxPerAddressDuringMint, "can not mint this many");
        _safeMint(msg.sender, quantity);
        refundIfOver(price * quantity);
    }

    // For marketing etc.
    function devMint(uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= amountForDevs, "too many already minted before dev mint");
        require(quantity % maxBatchSize == 0, "can only mint a multiple of the maxBatchSize");
        uint256 numChunks = quantity / maxBatchSize;
        for (uint256 i = 0; i < numChunks; i++) {
            _safeMint(msg.sender, maxBatchSize);
        }
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function isPublicSaleOn(uint256 priceWei, uint256 saleStartTime) public view returns (bool) {
        return priceWei != 0 && getCurrentTime() >= saleStartTime;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function setAllowList(address[] calldata addresses, uint8 numAllowedToMint) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _allowList[addresses[i]] = numAllowedToMint;
        }
    }

    // // metadata URI
    string private _baseTokenURI;

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{ value: address(this).balance }("");
        require(success, "Transfer failed.");
    }

    function numberMinted(address owner) public view returns (uint256) {
        return _numberMinted(owner);
    }

    function getOwnershipData(uint256 tokenId) external view returns (TokenOwnership memory) {
        return ownershipOf(tokenId);
    }

    // can be extended for testing purpose
    function getCurrentTime() internal view virtual returns (uint256) {
        return block.timestamp;
    }

    function setWhitelistSaleStartTime(uint32 whitelistSaleStartTime_) external onlyOwner {
        SaleConfig storage config = saleConfig;
        config.whitelistSaleStartTime = whitelistSaleStartTime_;
    }

    function setSaleStartTime(uint32 saleStartTime_) external onlyOwner {
        SaleConfig storage config = saleConfig;
        config.saleStartTime = saleStartTime_;
    }

    function setMintlistPrice(uint64 mintlistPrice_) external onlyOwner {
        SaleConfig storage config = saleConfig;
        config.mintlistPrice = mintlistPrice_;
    }

    function setPrice(uint64 price_) external onlyOwner {
        SaleConfig storage config = saleConfig;
        config.price = price_;
    }
}

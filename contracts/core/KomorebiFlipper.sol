// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.12;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721A.sol";

/// @title KomorebiFlipper
/// @author 0xmanga-eth
contract KomorebiFlipper is Context, Ownable, ReentrancyGuard, VRFConsumerBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    string constant ERROR_NOT_ENOUGH_LINK = "not enough LINK";
    bytes4 private constant ERC721_RECEIVER_SELECTOR =
        bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    bool public constant HEADS_SIDE = true;
    bool public constant TAILS_SIDE = false;

    struct Game {
        bool initialized;
        address player;
        uint256 nftStakeId;
        bool userSelectedSide;
        bool randomSelectedSide;
        bool completed;
        bool win;
        uint256 wonNFT;
    }

    // KNS NFT contract
    IERC721 private _komorebiNoSekaiNFT;

    // Available KNS NFTs
    uint256[] public knsPool;

    // Players data
    // Games mapped by VRF request id
    mapping(bytes32 => Game) games;

    // Chainlink configuration
    address private _vrfCoordinator;
    address private _linkToken;
    bytes32 private _vrfKeyHash;
    uint256 private _vrfFee;
    bool private _userMustPayLinkFees;

    constructor(
        address knsAddress,
        address vrfCoordinator_,
        address linkToken_,
        bytes32 vrfKeyHash_,
        uint256 vrfFee_
    ) VRFConsumerBase(vrfCoordinator_, linkToken_) {
        _komorebiNoSekaiNFT = IERC721(knsAddress);
        _vrfCoordinator = vrfCoordinator_;
        _linkToken = linkToken_;
        _vrfKeyHash = vrfKeyHash_;
        _vrfFee = vrfFee_;
        _userMustPayLinkFees = true;
    }

    /// @dev Play a new game.
    /// nftStakeId_ The id of the stake NFT.
    function play(uint256 nftStakeId_, bool chosenSide) external onlyIfNFTLeftInPool {
        address player = _msgSender();
        if (_userMustPayLinkFees) {
            IERC20 linkERC20 = IERC20(_linkToken);
            linkERC20.safeTransferFrom(player, address(this), _vrfFee);
        }
        require(LINK.balanceOf(address(this)) >= _vrfFee, ERROR_NOT_ENOUGH_LINK);
        _komorebiNoSekaiNFT.safeTransferFrom(_msgSender(), address(this), nftStakeId_);
        knsPool.push(nftStakeId_);
        bytes32 vrfRequestId = requestRandomness(_vrfKeyHash, _vrfFee);
        games[vrfRequestId] = Game(true, player, nftStakeId_, chosenSide, false, false, false, 0);
    }

    /// @dev See `VRFConsumerBase` documentation.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        Game storage game = games[requestId];
        if (game.initialized && !game.completed) {
            // Handle case when no more NFT left in the pool
            // Terminate the game and give back the NFT put at stake
            if (knsPool.length < 1) {
                // Give back the NFT put at stake by user
                _komorebiNoSekaiNFT.safeTransferFrom(_msgSender(), address(this), game.nftStakeId);
            } else {
                bool coinSide = randomness.mod(2) == 0;
                game.randomSelectedSide = coinSide;
                // Handle win
                if (coinSide == game.userSelectedSide) {
                    game.win = true;
                    game.wonNFT = popAvailableNFT();
                    // Give back the NFT put at stake by user
                    _komorebiNoSekaiNFT.safeTransferFrom(_msgSender(), address(this), game.nftStakeId);
                    // Transfer the won NFT to the winner
                    _komorebiNoSekaiNFT.safeTransferFrom(_msgSender(), address(this), game.wonNFT);
                }
                // We don't need to do anything special for the case when user lost
            }
            game.completed = true;
        }
    }

    /// @dev Get the number of available NFTs to win in the pool.
    function getAvailableNFTCount() external view returns (uint256) {
        return knsPool.length;
    }

    /// @dev Pop one available NFT from the pool.
    /// @dev Throws if no NFT left in the pool.
    function popAvailableNFT() internal returns (uint256) {
        require(knsPool.length > 0, "No more NFT in the pool");
        uint256 id = knsPool[knsPool.length - 1];
        knsPool.pop();
        return id;
    }

    /// @dev Set whether or not the user must support the LINK fees for VRF.
    /// @param value_ true if user must support the cost, false otherwise.
    function userMustSupportLinkFeesCost(bool value_) external onlyOwner {
        _userMustPayLinkFees = value_;
    }

    /// @notice Withdraw Link
    /// @dev See chainlink documentation.
    function withdrawLink() external onlyOwner {
        IERC20 erc20 = IERC20(_linkToken);
        uint256 linkBalance = LINK.balanceOf(address(this));
        if (linkBalance > 0) {
            erc20.transfer(owner(), linkBalance);
        }
    }

    modifier onlyIfNFTLeftInPool() {
        require(knsPool.length > 0, "No more NFT in the pool");
        _;
    }

    /// @dev Add KNS NFTs in the pool.
    /// @param ids The list of NFT ids.
    function addInPool(uint256[] calldata ids) external {
        for (uint256 i; i < ids.length; ) {
            _komorebiNoSekaiNFT.safeTransferFrom(_msgSender(), address(this), ids[i]);
            knsPool.push(ids[i]);
            unchecked {
                ++i;
            }
        }
    }

    /// @dev See `IERC721.onERC721Received`
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure returns (bytes4) {
        return ERC721_RECEIVER_SELECTOR;
    }
}

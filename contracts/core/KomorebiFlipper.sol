// SPDX-License-Identifier: Apache-2.0
// 人類の反撃はこれからだ。
// jinrui no hangeki wa kore kara da.

// Source code heavily inspired from deployed contract instance of Azuki collection
// https://etherscan.io/address/0xed5af388653567af2f388e6224dc7c4b3241c544#code
// The source code in the github does not have some important features.
// This is why we used directly the code from the deployed version.
pragma solidity >=0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC721A.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/// @title KomorebiFlipper
/// @author 0xmanga-eth
contract KomorebiFlipper is Ownable, ReentrancyGuard, VRFConsumerBase {
    using SafeMath for uint256;


    string constant ERROR_NOT_ENOUGH_LINK = "not enough LINK";
    
    // Chainlink configuration
    address _vrfCoordinator;
    address _linkToken;
    bytes32 _vrfKeyHash;
    uint256 _vrfFee;

    constructor(
        address vrfCoordinator_,
        address linkToken_,
        bytes32 vrfKeyHash_,
        uint256 vrfFee_
    ) VRFConsumerBase(vrfCoordinator_, linkToken_) {
        _vrfCoordinator = vrfCoordinator_;
        _linkToken = linkToken_;
        _vrfKeyHash = vrfKeyHash_;
        _vrfFee = vrfFee_;
    }


    /// @dev See `VRFConsumerBase` documentation.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
       
    }
}

// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.12;

import "../core/KomorebiNoSekai.sol";

import "hardhat/console.sol";

/// @title MockableTimeKomorebiNoSekai
/// @author 0xmanga
contract MockableTimeKomorebiNoSekai is KomorebiNoSekai {
    uint256 mockTime = 0;

    constructor(
        uint256 maxBatchSize_,
        uint256 collectionSize_,
        uint256 amountForDevs_,
        address vrfCoordinator_,
        address linkToken_,
        bytes32 vrfKeyHash_,
        uint256 vrfFee_
    )
        KomorebiNoSekai(
            maxBatchSize_,
            collectionSize_,
            amountForDevs_,
            vrfCoordinator_,
            linkToken_,
            vrfKeyHash_,
            vrfFee_
        )
    {}

    function setCurrentTime(uint256 _time) external onlyOwner {
        mockTime = _time;
    }

    function getCurrentTime() internal view virtual override returns (uint256) {
        return mockTime;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC20 } from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { CCIPReceiverUpgradeable } from "./CCIPReceiverUpgradeable.sol";
import { IUniswapV2Router02 } from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract LynkMessager is UUPSUpgradeable, CCIPReceiverUpgradeable {
    struct LynkMessagerStorage {
        IUniswapV2Router02 uniswapV2Router;
    }

    event OrderFilled(bytes32 messageId, address fromToken, uint256 fromAmount, address toToken, uint256 toAmount);

    event OrderWaiting(bytes32 messageId);

    function initialize(address router_, IUniswapV2Router02 uniswapV2Router_) external initializer {
        __CCIPReceiver_init(router_);

        LynkMessagerStorage storage $ = _getLynkMessagerStorage();
        $.uniswapV2Router = uniswapV2Router_;
    }

    // keccak256(abi.encode(uint256(keccak256("lynkswap.storage.lynkmessager")) - 1)) & ~ bytes32(uint256(0xff))
    bytes32 private constant LynkSwapStorageLocation =
        0x976509985809e047515ccc2c69ccb29a3b3da26dc470e8fda630ec865ee4e300;

    // handle a received message
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        // logic here
        (address inToken, address outToken, uint256 inAmount, uint256 minOut) =
            abi.decode(any2EvmMessage.data, (address, address, uint256, uint256));

        LynkMessagerStorage storage $ = _getLynkMessagerStorage();

        //
        bytes memory callData = abi.encodeWithSelector(
            $.uniswapV2Router.swapExactTokensForTokens.selector,
            inAmount,
            minOut,
            [inToken, outToken],
            0xba45b3d7A42c3554fa98bDC3F790da2676Cb0560,
            block.timestamp + 1
        );

        (bool success, bytes memory res) = address($.uniswapV2Router).call(callData);

        uint256[] memory amount = abi.decode(res, (uint256[]));

        if (success) {
            emit OrderFilled(any2EvmMessage.messageId, inToken, inAmount, outToken, amount[1]);
        } else {
            // save the intention and wait for suitable time
            emit OrderWaiting(any2EvmMessage.messageId);
        }
    }

    function _getLynkMessagerStorage() internal pure returns (LynkMessagerStorage storage $) {
        assembly {
            $.slot := LynkSwapStorageLocation
        }
    }

    // don't add auth for test
    function _authorizeUpgrade(address newImplementation) internal override { }
}

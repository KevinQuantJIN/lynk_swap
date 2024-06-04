// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC20 } from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import { CCIPReceiverUpgradeable } from "./CCIPReceiverUpgradeable.sol";
import { IUniswapV2Router02 } from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract LynkMessager is UUPSUpgradeable, CCIPReceiverUpgradeable, AutomationCompatibleInterface {
    struct Order {
        bytes data;
        bool tried;
    }

    struct LynkMessagerStorage {
        IUniswapV2Router02 uniswapV2Router;
        mapping(bytes32 => Order) orders;
        bytes32[] pendingOrders;
    }

    event OrderFilled(bytes32 messageId, address fromToken, uint256 fromAmount, address toToken, uint256 toAmount);

    event OrderWaiting(bytes32 messageId, address fromToken, uint256 fromAmount, address toToken);
    event OrderPending(bytes32 messageId, bytes data);

    function initialize(address router_, IUniswapV2Router02 uniswapV2Router_) external initializer {
        __CCIPReceiver_init(router_);

        LynkMessagerStorage storage $ = _getLynkMessagerStorage();
        $.uniswapV2Router = uniswapV2Router_;
    }

    // keccak256(abi.encode(uint256(keccak256("lynkswap.storage.lynkmessager")) - 1)) & ~ bytes32(uint256(0xff))
    bytes32 private constant LynkSwapStorageLocation =
        0x976509985809e047515ccc2c69ccb29a3b3da26dc470e8fda630ec865ee4e300;

    function checkUpkeep(bytes calldata /* checkData */ )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */ )
    {
        LynkMessagerStorage storage $ = _getLynkMessagerStorage();

        upkeepNeeded = $.pendingOrders.length != 0;
    }

    function performUpkeep(bytes calldata) external override {
        LynkMessagerStorage storage $ = _getLynkMessagerStorage();

        if ($.pendingOrders.length == 0) {
            revert("NullPending");
        }

        // get the last one and pop
        bytes32 messageId = $.pendingOrders[$.pendingOrders.length - 1];
        $.pendingOrders.pop();

        Order storage order = $.orders[messageId];

        // each order tried once
        if (order.tried) {
            revert("order tried");
        }
        order.tried = true;

        (address[] memory paths, uint256 inAmount, uint256 minOut, address receiver) =
            abi.decode(order.data, (address[], uint256, uint256, address));

        address inToken = paths[0];
        address outToken = paths[paths.length - 1];

        //
        bytes memory callData = abi.encodeWithSelector(
            $.uniswapV2Router.swapExactTokensForTokens.selector, inAmount, minOut, paths, receiver, block.timestamp + 1
        );

        // approve token
        IERC20(inToken).approve(address($.uniswapV2Router), inAmount);

        (bool success, bytes memory res) = address($.uniswapV2Router).call(callData);

        if (success) {
            uint256[] memory amount = abi.decode(res, (uint256[]));

            emit OrderFilled(messageId, inToken, inAmount, outToken, amount[1]);
        } else {
            // save the intention and wait for suitable time
            emit OrderWaiting(messageId, inToken, inAmount, outToken);
        }
    }

    // handle a received message
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        // save order
        LynkMessagerStorage storage $ = _getLynkMessagerStorage();
        $.orders[any2EvmMessage.messageId] = Order(any2EvmMessage.data, false);

        $.pendingOrders.push(any2EvmMessage.messageId);
    }

    function _getLynkMessagerStorage() internal pure returns (LynkMessagerStorage storage $) {
        assembly {
            $.slot := LynkSwapStorageLocation
        }
    }

    // don't add auth for test
    function _authorizeUpgrade(address newImplementation) internal override { }
}

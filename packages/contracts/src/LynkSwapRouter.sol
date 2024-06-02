// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC20 } from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

contract LynkSwapRouter is UUPSUpgradeable {
    struct LynkSwapRouterStorage {
        IRouterClient router;
        uint64 chainASelector;
        uint64 chainBSelector;
        uint64 chainCSelector;
        mapping(uint64 => address) messagers;
        mapping(uint256 => mapping(address => address)) tokenMaps;
    }

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough
        // balance to cover the fees.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not
        // been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.

    // Event emitted when the tokens are transferred to an account on another chain.
    // The chain selector of the destination chain.
    // The address of the receiver on the destination chain.
    // The token address that was transferred.
    // The token amount that was transferred.
    // the token address used to pay CCIP fees.
    // The fees paid for sending the message.
    event TokensTransferred( // The unique ID of the message.
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 tokenAmount,
        address feeToken,
        uint256 fees
    );

    event InvokeSwap(uint256 feeAmount);

    // keccak256(abi.encode(uint256(keccak256("lynkswap.storage.router")) - 1)) & ~ bytes32(uint256(0xff))
    //
    bytes32 private constant LynkSwapRouterStorageLocation =
        0x42631c0a284ed7d4e8004e5fc9bdf44dbbde6ac8d81ad52470bb1ab538a9aa00;

    function initialize(
        IRouterClient router_,
        uint64 chainASelector_,
        uint64 chainBSelector_,
        uint64 chainCSelector_
    )
        external
        initializer
    {
        LynkSwapRouterStorage storage $ = _getLynkSwapRouterStorage();
        $.router = router_;
        $.chainASelector = chainASelector_;
        $.chainBSelector = chainBSelector_;
        $.chainCSelector = chainCSelector_;
    }

    /**
     * @dev a for amoy, b for base sepolia, c for fuji
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountA,
        uint256 minA,
        uint256 amountB,
        uint256 minB,
        uint256 amountC,
        uint256 minC
    )
        external
    {
        LynkSwapRouterStorage storage $ = _getLynkSwapRouterStorage();

        uint256 feeA = _swapOnSingleChain($.chainASelector, tokenIn, tokenOut, amountA, minA);
        uint256 feeB = _swapOnSingleChain($.chainBSelector, tokenIn, tokenOut, amountB, minB);
        uint256 feeC = _swapOnSingleChain($.chainCSelector, tokenIn, tokenOut, amountC, minC);

        uint256 totalFee = feeA + feeB + feeC;

        emit InvokeSwap(totalFee);
    }

    function setChainMessager(uint64 chainSelector, address LynkMessager) public {
        LynkSwapRouterStorage storage $ = _getLynkSwapRouterStorage();

        $.messagers[chainSelector] = LynkMessager;
    }

    function setTokenMap(uint64 chainSelector, address originToken, address destToken) public {
        LynkSwapRouterStorage storage $ = _getLynkSwapRouterStorage();

        $.tokenMaps[chainSelector][originToken] = destToken;
    }

    function _swapOnSingleChain(
        uint64 chainSelector,
        address inToken,
        address outToken,
        uint256 inAmount,
        uint256 minOut
    )
        internal
        returns (uint256 fees)
    {
        LynkSwapRouterStorage storage $ = _getLynkSwapRouterStorage();

        address messager = $.messagers[chainSelector];

        bytes memory swapData =
            abi.encode($.tokenMaps[chainSelector][inToken], $.tokenMaps[chainSelector][outToken], inAmount, minOut);

        Client.EVM2AnyMessage memory evm2AnyMessage =
            _buildCCIPMessage(messager, inToken, inAmount, address(0), swapData);

        // Get the fee required to send the message
        fees = $.router.getFee(chainSelector, evm2AnyMessage);

        if (fees > address(this).balance) {
            revert NotEnoughBalance(address(this).balance, fees);
        }

        // approve the Router to spend tokens on contract's behalf. It will spend the amount of the given token
        IERC20(inToken).approve(address($.router), inAmount);

        // Send the message through the router and store the returned message ID
        bytes32 messageId = $.router.ccipSend{ value: fees }(chainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit TokensTransferred(messageId, chainSelector, messager, inToken, inAmount, address(0), fees);
    }

    /// @notice Construct a CCIP message.
    /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for tokens transfer.
    /// @param _receiver The address of the receiver.
    /// @param _token The token to be transferred.
    /// @param _amount The amount of the token to be transferred.
    /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP
    /// message.
    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress,
        bytes memory data
    )
        private
        pure
        returns (Client.EVM2AnyMessage memory)
    {
        // Set the token amounts
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({ token: _token, amount: _amount });

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver), // ABI-encoded receiver address
            data: data,
            tokenAmounts: tokenAmounts, // The amount and type of token being transferred
            extraArgs: Client._argsToBytes(
                // set gas limit to max
                Client.EVMExtraArgsV1({ gasLimit: 3_000_000 })
                ),
            // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
            feeToken: _feeTokenAddress
        });
    }

    function _getLynkSwapRouterStorage() internal pure returns (LynkSwapRouterStorage storage $) {
        assembly {
            $.slot := LynkSwapRouterStorageLocation
        }
    }

    // don't add auth for test
    function _authorizeUpgrade(address newImplementation) internal override { }
}

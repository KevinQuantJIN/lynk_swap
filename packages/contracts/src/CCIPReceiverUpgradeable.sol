// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IAny2EVMMessageReceiver } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";
import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { IERC165 } from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/utils/introspection/IERC165.sol";

/// @title CCIPReceiver - Base contract for CCIP applications that can receive messages.
abstract contract CCIPReceiverUpgradeable is IAny2EVMMessageReceiver, IERC165 {
    /// @custom:storage-location erc7201:openzeppelin.storage.Ownable2Step
    struct CCIPReceiverStorage {
        address _rounter;
    }

    // keccak256(abi.encode(uint256(keccak256("chainlink.storage.CCIPReceiverUpgradeable")) - 1)) &
    // ~bytes32(uint256(0xff))
    bytes32 private constant CCIPReceiverStorageLocation =
        0xb9605d6807cee7e996cb505aab0fff682142fb832cd7587ec7f7258d80300000;

    function _getCCIPReceiverStorage() private pure returns (CCIPReceiverStorage storage $) {
        assembly {
            $.slot := CCIPReceiverStorageLocation
        }
    }

    function __CCIPReceiver_init(address router) internal {
        if (router == address(0)) revert InvalidRouter(address(0));
        _getCCIPReceiverStorage()._rounter = router;
    }

    /// @notice IERC165 supports an interfaceId
    /// @param interfaceId The interfaceId to check
    /// @return true if the interfaceId is supported
    /// @dev Should indicate whether the contract implements IAny2EVMMessageReceiver
    /// e.g. return interfaceId == type(IAny2EVMMessageReceiver).interfaceId || interfaceId == type(IERC165).interfaceId
    /// This allows CCIP to check if ccipReceive is available before calling it.
    /// If this returns false or reverts, only tokens are transferred to the receiver.
    /// If this returns true, tokens are transferred and ccipReceive is called atomically.
    /// Additionally, if the receiver address does not have code associated with
    /// it at the time of execution (EXTCODESIZE returns 0), only tokens will be transferred.
    function supportsInterface(bytes4 interfaceId) public pure virtual override returns (bool) {
        return interfaceId == type(IAny2EVMMessageReceiver).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    /// @inheritdoc IAny2EVMMessageReceiver
    function ccipReceive(Client.Any2EVMMessage calldata message) external virtual override onlyRouter {
        _ccipReceive(message);
    }

    /// @notice Override this function in your implementation.
    /// @param message Any2EVMMessage
    function _ccipReceive(Client.Any2EVMMessage memory message) internal virtual;

    /////////////////////////////////////////////////////////////////////
    // Plumbing
    /////////////////////////////////////////////////////////////////////

    /// @notice Return the current router
    /// @return CCIP router address
    function getRouter() public view returns (address) {
        return address(_getCCIPReceiverStorage()._rounter);
    }

    error InvalidRouter(address router);

    /// @dev only calls from the set router are accepted.
    modifier onlyRouter() {
        if (msg.sender != address(_getCCIPReceiverStorage()._rounter)) revert InvalidRouter(msg.sender);
        _;
    }
}

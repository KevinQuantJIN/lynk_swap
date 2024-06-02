// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lynk is ERC20 {
    constructor() ERC20("Lynk", "Lynk") { }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

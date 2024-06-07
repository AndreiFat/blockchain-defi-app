// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    /**
     * @dev Prints Hello World string
   */
    function print() public pure returns (string memory) {
        return "Hello World!";
    }
}
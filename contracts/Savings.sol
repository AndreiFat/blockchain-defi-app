// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Savings {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function initializeBalance(address account, uint256 amount) external payable {
        require(msg.sender == owner, "Only owner can initialize balance");
        require(balances[account] == 0, "Balance already initialized");
        balances[account] = amount;
        emit Deposit(account, amount);
    }
}
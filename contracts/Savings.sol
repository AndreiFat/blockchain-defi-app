// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Savings {
    address public owner;

    struct Goal {
        uint256 balance;
        string name;
        uint256 targetAmount;
        uint256 deadline;
        bool completed;
    }

    mapping(address => uint256) public balances;
    mapping(address => uint256) public userGoalCount;
    mapping(address => mapping(uint256 => Goal)) public goals;

    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);
    event GoalCreated(address indexed user, uint256 indexed goalIndex, string name, uint256 targetAmount, uint256 deadline);
    event GoalFunded(address indexed user, uint256 indexed goalIndex, uint256 amount);
    event GoalWithdrawn(address indexed user, uint256 indexed goalIndex, uint256 amount);

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

    function createGoal(address userAddress, string memory name, uint256 targetAmount, uint256 deadline) public {
        uint256 goalIndex = userGoalCount[userAddress];
        goals[userAddress][goalIndex] = Goal(0, name, targetAmount, deadline, false);
        userGoalCount[userAddress]++;
        emit GoalCreated(userAddress, goalIndex, name, targetAmount, deadline);
    }

    function fundGoal(uint256 goalIndex) public payable {
        // Verify that the goal index is valid
        require(goalIndex < userGoalCount[msg.sender], "Invalid goal index. Please provide a valid index.");

        // Verify that the goal has not already been completed
        require(!goals[msg.sender][goalIndex].completed, "Goal has already been completed.");

        // Calculate the total balance after funding the goal
        uint256 totalBalance = goals[msg.sender][goalIndex].balance + msg.value;

        // Verify that the total balance does not exceed the target amount
        require(totalBalance <= goals[msg.sender][goalIndex].targetAmount, "Target amount exceeded. Cannot fund the goal beyond the target amount.");

        // Fund the goal and emit an event
        goals[msg.sender][goalIndex].balance += msg.value;
        emit GoalFunded(msg.sender, goalIndex, msg.value);
    }

    function withdrawFromGoal(address userAddress, uint256 goalIndex, uint256 amount) public {
        require(goals[userAddress][goalIndex].balance >= amount, "Insufficient goal balance");

        goals[userAddress][goalIndex].balance -= amount;
        payable(msg.sender).transfer(amount); // Transfer Ether to the message sender

        emit GoalWithdrawn(userAddress, goalIndex, amount);
    }

    function getGoal(address userAddress, uint256 goalIndex) public view returns (Goal memory) {
        return goals[userAddress][goalIndex];
    }

    function getGoalsCount(address userAddress) public view returns (uint256) {
        return userGoalCount[userAddress];
    }

    function getGoalBalance(address userAddress, uint256 goalIndex) public view returns (uint256) {
        return goals[userAddress][goalIndex].balance;
    }

    function getAllGoals(address user) public view returns (Goal[] memory) {
        // Get the number of goals for the user
        uint256 goalCount = userGoalCount[user];

        // Initialize an array to store all goals
        Goal[] memory allGoals = new Goal[](goalCount);

        // Iterate over each goal and add it to the array
        for (uint256 i = 0; i < goalCount; i++) {
            allGoals[i] = goals[user][i];
        }

        return allGoals;
    }
}

// SPDX-License-Identifier: MITcd
pragma solidity ^0.8.26;

contract UserManagement {
    struct User {
        string name;
        string email;
    }

    mapping(address => User) public users;

    function updateUser(address userAddress, string memory name, string memory email) public {
        User storage user = users[userAddress];
        user.name = name;
        user.email = email;
    }
}

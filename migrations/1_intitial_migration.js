const HelloWorld = artifacts.require("HelloWorld")
const Savings = artifacts.require("Savings")

module.exports = function (deployer) {
    deployer.deploy(HelloWorld);
    deployer.deploy(Savings);
};

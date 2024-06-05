const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

const abiPath = path.resolve(__dirname, 'build/src_contracts_UserManagement_sol_UserManagement.abi');
const bytecodePath = path.resolve(__dirname, 'build/src_contracts_UserManagement_sol_UserManagement.bin');

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const deployContract = async () => {
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
    const bytecode = fs.readFileSync(bytecodePath, 'utf-8');

    const contract = new web3.eth.Contract(abi);

    const accounts = await web3.eth.getAccounts();
    const deployedContract = await contract.deploy({ data: bytecode }).send({
        from: accounts[0],
        gas: '1000000',
    });

    console.log('Contractul a fost implementat la adresa:', deployedContract.options.address);
};

deployContract();


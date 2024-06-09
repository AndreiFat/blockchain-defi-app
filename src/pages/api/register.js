import connectToDatabase from '@/libraries/mongodb';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import {encrypt} from "@/components/utils/encryptionFunctions";
import Web3 from "@/services/web3";
import Contract from "@/services/contract";
import logger from '@/debbuging/logger';

const centralAccount = '0x17840877aB8335887E74C2Be0F6baB218d568De7';
const centralAccountPrivateKey = '0x7dc8ddca86150bd5da379924a888d7ba28c38a43f436cf2eab887e569294c5ab';
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Paste your contract address here
const contract = Contract();
export default async function handler(req, res) {

    const {name, email, password} = req.body;
    try {
        await connectToDatabase();
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        logger.info(existingUser)
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const account = await createNewUserAddress();
        logger.info(`private key: ${account.privateKey}`)
        const encryptedPrivateKey = encrypt(account.privateKey);
        logger.info('the account was successfuly accesed into the register', account);
        // Create new user
        const newUser = new User({
            username: name,
            email: email,
            password: hashedPassword,
            ethAddress: account.address,
            privateKey: encryptedPrivateKey
        });
        logger.info(newUser)

        await newUser.save();
        return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

const createNewUserAddress = async () => {
    try {
        const newAccount = await createAndFundAccount();
        logger.info(`Address: ${newAccount.address}`);
        logger.info(`Private Key: ${newAccount.privateKey}`);

        const balanceInWei = await contract.methods.getBalance().call({from: newAccount.address});
        const balance = Web3.utils.fromWei(balanceInWei, 'ether')
        logger.info('Balanta contului', balance);

        return newAccount;
    } catch (error) {
        logger.error('Error creating and funding account:', error);
    }
};

const createAndFundAccount = async () => {
    const account = Web3.eth.accounts.create();
    logger.info(`Created account: ${account.address}`);

    const fundAmount = '0.01'; // 0.01 Ether
    const amountInWei = Web3.utils.toWei(fundAmount, 'ether');

    const gasPrice = await Web3.eth.getGasPrice();
    const gasLimit = 21000;

    const tx = {
        from: centralAccount,
        to: account.address,
        value: amountInWei,
        gas: gasLimit,
        gasPrice: gasPrice
    };

    try {
        const signedTx = await Web3.eth.accounts.signTransaction(tx, centralAccountPrivateKey);
        const receipt = await Web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        logger.info('Funding transaction receipt:', receipt);
        logger.info(`New account created and funded: ${account.address}`);


        // Initialize the balance in the smart contract
        await initializeBalanceInContract(account, amountInWei);

        return account;
    } catch (error) {
        logger.error('Transaction error:', error);
    }
};

const initializeBalanceInContract = async (accountCreated, amountInWei) => {
    try {
        // Get the owner's address from the contract
        const ownerAddress = await contract.methods.owner().call();

        logger.info(`Initializing balance for ${accountCreated.address} with ${amountInWei} Wei`);

        // Prepare the transaction data
        const txData = contract.methods.initializeBalance(accountCreated.address, amountInWei).encodeABI();
        // Sign the transaction using the owner's private key
        const signedTx = await Web3.eth.accounts.signTransaction({
            from: ownerAddress, // Sender's address (contract owner)
            to: contractAddress, // Contract address
            data: txData, // Transaction data
            gas: 2100000, // Gas limit
            gasPrice: await Web3.eth.getGasPrice() // Gas price
        }, process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY); // Owner's private key

        // Send the signed transaction to the network
        const receipt = await Web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        logger.info('Initialize balance transaction receipt:', receipt);
    } catch (error) {
        logger.error('Error during initializing balance:', error);
    }
};

import connectToDatabase from '@/libraries/mongodb';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import web3 from "@/services/web3";
import logger from '@/debbuging/logger';

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

        logger.info('the account was successfuly accesed into the register', account);
        // Create new user
        const newUser = new User({
            username: name,
            email: email,
            password: hashedPassword,
            ethAddress: account,
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
        const accounts = await web3.eth.getAccounts();
        logger.info(accounts)
        if (accounts.length > 1) {
            let availableAccount;
            for (let i = 1; i < accounts.length; i++) {
                const account = accounts[i];
                // Check if the account is not already in use
                const user = await User.findOne({ethAddress: account});
                if (!user) {
                    availableAccount = account;
                    return availableAccount;
                }
            }
        } else {
            logger.info("No accounts are available.");
        }
    } catch (error) {
        logger.error('Error creating account:', error);
    }
};


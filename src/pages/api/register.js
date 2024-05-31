import connectToDatabase from '../libraries/mongodb';
import User from '../model/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const {name, email, password} = req.body;
    try {
        await connectToDatabase();
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        console.log(existingUser)
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

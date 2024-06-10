import connectToDatabase from '@/libraries/mongodb';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import logger from '@/debbuging/logger';
import {getSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, email } = req.body;

    try {
        await connectToDatabase();

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        const session = await getServerSession(req, res, authOptions);
        if (session) {
            logger.info(session.user.name)
            logger.info(session.user.email)
            session.user.name = username || session.user.name;
            session.user.email = email || session.user.email;
            logger.info(session.user.name)
            logger.info(session.user.email)
            // Optionally, you can update the JWT token if you're using JWT-based sessions
            req.session = session;
        }
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "internal server error"});
    }
}

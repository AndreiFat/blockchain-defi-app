import {getSession} from "next-auth/react";
import User from "@/model/User";

export default async function handler(req, res) {
    const session = await getSession({req});

    if (!session) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    try {
        const user = await User.findOne({email: session.user.email});
        res.status(200).json({user});
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}
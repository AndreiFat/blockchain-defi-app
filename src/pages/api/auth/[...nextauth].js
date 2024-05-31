import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from '../../libraries/mongodb';
import User from '../../model/User';
import bcrypt from 'bcryptjs';

export const authOptions = {

    providers: [
        CredentialsProvider({

            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                await connectToDatabase();

                const email = credentials.username;
                const password = credentials.password;
                const user = await User.findOne({email});

                if (user && await bcrypt.compare(password, user.password)) {
                    return {id: user._id, name: user.username, email: user.email};
                } else {
                    return null;
                }
            },
        })
    ],
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/signout',
        // error: '/auth/error',
        // verifyRequest: '/auth/verify-request',
        // newUser: null,
    },
    session: {
        jwt: true,
        maxAge: 24 * 60 * 60, // 24 hours (in seconds)
    },
}

export default NextAuth(authOptions)
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from '@/libraries/mongodb';
import User from '@/model/User';
import bcrypt from 'bcryptjs';
import logger from "@/debbuging/logger";

export const authOptions = {
    secret: process.env.AUTH_SECRET,
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
                    logger.info(user)
                    return {name: user.username, email: user.email, ethAddress: user.ethAddress};
                } else {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, trigger, session}) {
            if (trigger === 'update' && session?.name && session?.name) {
                token.name = session.name;
                token.email = session.email;
            }

            return token
        },
        async session({session, trigger, newSession}) {
            if (trigger === "update" && newSession && (newSession.name || newSession.email)) {
                const updateData = {};
                if (newSession.name && typeof newSession.name === 'string' && newSession.name.trim() !== '') {
                    updateData.name = newSession.name;
                }
                if (newSession.email && typeof newSession.email === 'string' && newSession.email.trim() !== '') {
                    updateData.email = newSession.email;
                }

                if (Object.keys(updateData).length > 0) {
                    await connectToDatabase();
                    await User.updateOne({email: session.user.email}, {$set: updateData});

                    if (updateData.name) {
                        session.user.name = updateData.name;
                    }
                    if (updateData.email) {
                        session.user.email = updateData.email;
                    }
                }
            }
            return session;
        }
    },
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
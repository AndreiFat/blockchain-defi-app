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
        async jwt({ token, trigger, session }) {
            if (trigger === 'update' && session?.firstname && session?.lastname) {
                token.firstname = session.firstname ;
                token.lastname = session.lastname;
            }

            return token
        },
        async session({ session, trigger, newSession }) {
            // Note that `newSession` can be any arbitrary object, remember to validate it!
            if (trigger === "update" && newSession && newSession.name) {
                // You can update the session in the database if it's not already updated.
                // await adapter.updateUser(session.user.id, { name: newSession.name })

                // Make sure the updated value is reflected on the client
                session.user.name = newSession.name;
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
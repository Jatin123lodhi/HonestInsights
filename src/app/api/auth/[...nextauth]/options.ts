import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        await dbConnect();
        try {
          console.log(credentials.identifier,  ' ------cread ident')
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier }, // will check later if we remove any type from credentials can we access credentials.email and credentails.password
              { username: credentials?.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username;
        }
      return token;
    },
  
    async session({ session,token }) {
        if(token){
            session.user._id = token._id;
            session.user.isVerified= token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username
        }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
 
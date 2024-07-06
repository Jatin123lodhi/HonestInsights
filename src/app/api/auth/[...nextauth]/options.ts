import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

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
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],

  callbacks: {
    
    async signIn({ user, account, profile}){
      await dbConnect();
      // console.log({ user, account, profile})
      // first check the email is alreay present in database or not
      // if yes - it means details are already saved - do nothing
      // if no - save the details in the database 
      const email = user.email
      // TODO: will handle profile.login  typescript issue
      const userFound = await UserModel.findOne({email})
      if(!userFound){
        // console.log('new user')
        // save it to database 
        const password = Math.floor(10000+ Math.random()*9000).toString()
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
          username : user.name,
          email,
          password: hashedPassword,
          verifyCode:"not required",
          verifyCodeExpiry: expiryDate,
          isVerified: true,
          isAcceptingMessage: true,
          messages: [],
        });
        await newUser.save();
      }else{
        // already saved in database
        // console.log('already saved to database just login')
      }
      return true
    },
    async jwt({ token, user }) {
        // console.log('user in jwt callback ',user)
        // console.log('token in jwt callback ',token)
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
 

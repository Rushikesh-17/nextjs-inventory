import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { prisma } from "../../../config/prisma";
import { redirect } from "next/dist/server/api-utils";


export const authOptions:NextAuthOptions = ({

  adapter:PrismaAdapter(prisma),

  secret: process.env.SECRET,

  session: {
    strategy: "database",
    maxAge: 60*60*24*30,
    updateAge:60*60*24,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID|| "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  useSecureCookies: process.env.NODE_ENV === "production",
  
  pages:{
    signIn: '/auth/signin',
  },

  callbacks:{

    async redirect({url,baseUrl}){
      return url.startsWith(baseUrl)
      ? Promise.resolve(url)
      : Promise.resolve(baseUrl)
    },

    async session({session,token,user}) {
      if(session?.user) session.user.id = user.id;
      return session;
      
    }
  },

  events: {},

  debug : false,


})

export default(NextAuth(authOptions));

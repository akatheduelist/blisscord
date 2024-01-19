import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/app/helpers/redis";

// Reminds us with error in prod if environment variables are not set
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  // Return environment variables from .env file
  return { clientId, clientSecret };
}

// Use JSON Web Token as our NextAuthOption to avoid session information being stored in database
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    // Using next-auth built-in GoogleProvider
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
      // TODO GitHub?
      // TODO Other Providers?
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Is the user in the database? Send get request to fetchRedis to query the db.
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      // If the user is not in the database
      if (!dbUserResult) {
        // Assert we know the type 'user' exisits
        token.id = user!.id;
        return token;
      }

      // dbUser is returned as JSON, parse into POJO as User type
      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    // Session is generated
    async session({ session, token }) {
      // If session exisits return token
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session; // Else return session
    },
    redirect() {
      return "/dashboard";
    },
  },
};

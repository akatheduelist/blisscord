import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/app/helpers/redis";

// Remind us with error in prod if values not set
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  // Else return values from env file
  return { clientId, clientSecret };
}

// Use JSON Web Token to avoid session being stored in database
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
      // TODO GitHub?
      // TODO Other Providers?
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Is the user in the database?
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      // If user is not in the database
      if (!dbUserResult) {
        // Assert we know the type 'user' exisits
        token.id = user!.id;

        // Bug -> Why am I not getting the email from Redis?
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      // User is in the database, return user
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };
    },

    // Session is generated
    async session({ session, token }) {
      // If session exisits return token
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }

      return session; // Else return session
    },
    redirect() {
      return "/dashboard";
    },
  },
};

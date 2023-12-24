import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"

// Remind us with error in prod if values not set
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  // Else return values from env file
  return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt' // Use JSON Web Token to avoid session being stored in database
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret
      // TODO GitHub?
      // TODO Other Providers?
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null // Is the user in the database?

      if (!dbUser) { // If user is not in the database
        token.id = user!.id // Assert we know the type 'user' exisits
        return token
      }

      return { // User is in the database, return user
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image
      }
    },
    async session({ session, token }) { // Session is generated
      if (token) { // If session exisits return token
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
      }

      return session // Else return session
    },
    redirect() {
      return '/dashboard'
    }
  }
}


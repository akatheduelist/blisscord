import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// NextAuth types defined
type UserId = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId
    }
  }
}

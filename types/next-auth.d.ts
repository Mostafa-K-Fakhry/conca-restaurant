import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * هنا بنزود البيانات اللي راجعة في الـ Session
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  /**
   * وهنا بنزود البيانات اللي في الـ User الأصلي
   */
  interface User {
    id: string
    role: string
  }
}
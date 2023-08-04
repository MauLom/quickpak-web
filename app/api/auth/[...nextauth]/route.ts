// /api/auth/[...nextauth].js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextApiRequest, NextApiResponse } from "next"

// async function auth(req: NextApiRequest, res: NextApiResponse) {

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const providers = [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "email", placeholder: "something@example.com" },
        password: { label: "Password", type: "password" }
      },
      
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "admin@ex.com", password: "12345" }

        if (credentials?.username === user.email && credentials?.password === user.password) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
  const isDefaultSigninPage = req?.method === "GET" && req?.query?.nextauth?.includes("signin")
  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub
        session.user.name = token.sub
        session.user.image = "https://www.fillmurray.com/128/128"
        return session
      },
    },
  })
}

export { handler as GET, handler as POST }




// /api/auth/[...nextauth].js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUsers } from "../../../lib/requests"

const handler = async (req: any, res: any) => {
  const providers = [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credenciales",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Nombre de usuario", type: "string", placeholder: "Tu nombre de usuario" },
        password: { label: "Clave de acceso", type: "password" }
      },

      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        let users: any[] = []
        await getUsers().then(
          data => { users = data?.users })
        var result = users.find(userOnBd => {
          return credentials?.username === userOnBd?.userName && credentials?.password === userOnBd?.password
        })
        return undefined === result ? null : result
      }
    })
  ]
  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, account, profile, user }) {

        if (account) {
          const objProv: any = user
          token.id = objProv['_id']
          token.picture = objProv['role']
          token.email = objProv['matrizId']
          token.sub = objProv['userName']
          token.accessToken = account.access_token
        }

        return token
      },

      async session({ session, token }: { session: any; token: any }) {
        session.user.name = token.sub
        session.user.id = token.id
        session.user.image = token.picture
        session.user.email = token.email
        return session
      },
    },
  })
}

export { handler as GET, handler as POST }




import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

const handler = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id as string
        token.username = profile.username as string
        token.discriminator = (profile as any).discriminator as string
        token.avatar = (profile as any).avatar as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.discordId as string
        session.user.username = token.username as string
        session.user.discriminator = token.discriminator as string
        session.user.avatar = token.avatar as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }

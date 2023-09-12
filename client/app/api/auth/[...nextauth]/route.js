import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      async profile(profile) {
        const { id, login, name, email, avatar_url } = profile;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/oauth`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              picture: avatar_url,
              oauth: { github: { id, username: login } },
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          data.user.token = data.token;
          return { ...data.user, id };
        } else {
          throw new Error(JSON.stringify(data.errors));
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const { name, email, picture, sub } = profile;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/oauth`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              picture,
              oauth: { google: { email, id: sub } },
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          data.user.token = data.token;
          return { ...data.user, id: sub };
        } else {
          throw new Error(JSON.stringify(data.errors));
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {
          data.user.token = data.token;
          return data.user;
        } else {
          throw new Error(JSON.stringify(data.errors));
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url;
    },
    async jwt({ token, user, account }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

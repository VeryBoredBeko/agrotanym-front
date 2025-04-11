import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// function which will refresh access token via making request to provaider
// fetches new access and resresh tokens from provaider
async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_KEYCLOAK_ID!,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// NextAuth handler function
// function defines Keycloak as a provider
// function defines authenticating strategy as JWT
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {

      // this branch would work if user is not authenticated
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires:
            Date.now() + (account.expires_in as number) * 1000,
          refreshToken: account.refresh_token,
        };
      }

      // this branch would work if access token is not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // otherwise would be called refreshing access token attempt
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {

      // if refreshing access token ended unsuccessfully
      // this branch would pass error to session object
      if (token.error === "RefreshAccessTokenError") {
        session.error = token.error;
        return session;
      }

      session.accessToken = token.accessToken;
      session.idToken = token.idToken;

      return session;
    },
  },

  // Auth.js secret to signaturing tokens
  secret: process.env.NEXTAUTH_SECRET,
});

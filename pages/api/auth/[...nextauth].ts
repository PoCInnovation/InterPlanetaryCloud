import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from 'config/constants';

export default NextAuth({
	providers: [
		GithubProvider({
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			authorization: { params: { scope: 'repo' } },
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) return { ...token, accessToken: account.access_token };
			return token;
		},
		async session({ session, token }) {
			return { ...session, accessToken: token.accessToken };
		},
	},
});

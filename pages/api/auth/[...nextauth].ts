import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? '',
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET ?? '',
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

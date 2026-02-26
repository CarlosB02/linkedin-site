import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_build",
	database: prismaAdapter(prisma, {
		provider: "sqlite",
	}),
	//allow any localhost port in development, and production URL
	trustedOrigins: [
		"http://localhost:*", //allows any port in development
		...(process.env.NEXT_PUBLIC_APP_URL
			? [process.env.NEXT_PUBLIC_APP_URL]
			: []),
	],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	user: {
		additionalFields: {
			credits: {
				type: "number",
				required: false,
				defaultValue: 0,
			},
		},
	},
});

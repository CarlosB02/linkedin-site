import { createAuthClient } from "better-auth/react";

//get base URL dynamically from current origin (works on any port in dev and in prod)
const getBaseURL = () => {
	if (typeof window !== "undefined") return window.location.origin;
	//fallback for SSR (shouldn't be used in client components, but just in case)
	return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
});

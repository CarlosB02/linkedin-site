import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	console.error(
		"⚠️  Missing STRIPE_SECRET_KEY environment variable. Add it to your .env file or Vercel environment settings.",
	);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-11-17.clover",
	typescript: true,
});

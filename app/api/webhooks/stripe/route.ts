import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { addCreditsFromPayment } from "@/app/actions";
import { stripe } from "@/lib/stripe";

//disable body parsing, we need the raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	const body = await req.text();
	const signature = req.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "No signature provided" },
			{ status: 400 },
		);
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		console.error("STRIPE_WEBHOOK_SECRET is not set");
		return NextResponse.json(
			{ error: "Webhook secret not configured" },
			{ status: 500 },
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "Unknown error";
		console.error("Webhook signature verification failed:", errorMessage);
		return NextResponse.json(
			{ error: `Webhook Error: ${errorMessage}` },
			{ status: 400 },
		);
	}

	//handle checkout.session.completed event
	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;

		try {
			//extract metadata from session
			const userId = session.metadata?.userId;
			const packageId = session.metadata?.packageId;
			const creditsStr = session.metadata?.credits;
			const stripeSessionId = session.id;
			const amountTotal = session.amount_total || 0;
			const currency = session.currency || "eur";

			if (!userId || !packageId || !creditsStr) {
				console.error(
					"Missing required metadata (userId, packageId, or credits)",
				);
				return NextResponse.json(
					{ error: "Missing required metadata" },
					{ status: 400 },
				);
			}

			//parse credits from metadata (stored as string in stripe metadata)
			const credits = parseInt(creditsStr, 10);
			if (isNaN(credits) || credits <= 0) {
				console.error("Invalid credits value in metadata:", creditsStr);
				return NextResponse.json(
					{ error: "Invalid credits value" },
					{ status: 400 },
				);
			}

			//forward to server action for business logic
			await addCreditsFromPayment({
				userId,
				packageId,
				stripeSessionId,
				amount: amountTotal,
				currency,
				credits,
			});

			return NextResponse.json({ received: true });
		} catch (error) {
			console.error("Error processing webhook:", error);
			return NextResponse.json(
				{ error: "Error processing webhook" },
				{ status: 500 },
			);
		}
	}

	//return 200 for other event types (we only care about checkout.session.completed)
	return NextResponse.json({ received: true });
}

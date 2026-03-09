"use server";

import { headers } from "next/headers";
import Replicate from "replicate";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function enhanceImage(
	generationId: string,
	type: string,
	currentImageBase64?: string,
): Promise<{ predictionId: string }> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) throw new Error("Unauthorized");

	let { data: user } = await supabase.from('user').select('*').eq('id', authUser.id).single();

	if (!user) {
		const { data: newUser, error } = await supabase.from('user').insert({
			id: authUser.id,
			email: authUser.email!,
			name: authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
			credits: 0,
		}).select().single();
		if (error) throw error;
		user = newUser;
	}

	if (user.credits < 10) {
		throw new Error("Insufficient credits (10 required)");
	}

	const { data: generation, error: genError } = await supabase.from('Generation').select('*').eq('id', generationId).single();

	if (genError || !generation || !generation.originalImage) {
		throw new Error("Generation not found");
	}

	// Construct prompt based on type
	let promptModification = "";
	switch (type) {
		case "Smile":
			promptModification =
				"smiling naturally, happy expression, approachable, professional headshot, preserve user appearance, preserve clothing";
			break;
		case "Open Eyes":
			promptModification =
				"eyes open naturally, attentive look, professional headshot, preserve user appearance, preserve clothing";
			break;
		case "Fix Lighting":
			promptModification =
				"perfect studio lighting, soft shadows, professional photography, high quality, preserve user appearance, preserve clothing";
			break;
		case "Background":
			promptModification =
				"modern professional office background, depth of field, blurred background, preserve user appearance, preserve clothing";
			break;
		case "Remove Background":
			promptModification =
				"solid white background, clean background, passport style photo, preserve user appearance, preserve clothing";
			break;
		default:
			promptModification =
				"high quality, professional headshot, preserve user appearance, preserve clothing";
	}

	const fullPrompt = `${promptModification}, ${generation.prompt || "Professional LinkedIn headshot"}`;

	// Use higher strength for dramatic changes like background removal
	const strength = ["Background", "Remove Background"].includes(type) ? 0.85 : 0.65;

	console.log(`[enhanceImage] type: ${type}, generationId: ${generationId}, usingCurrentImage: ${!!currentImageBase64}, strength: ${strength}`);

	const prediction = await replicate.predictions.create({
		version: "google/nano-banana",
		model: "google/nano-banana",
		input: {
			prompt: fullPrompt,
			image_input: [currentImageBase64 ?? generation.originalImage!],
			strength: strength,
			output_format: "jpg",
		},
	});

	await supabase.from('user').update({ credits: user.credits - 10 }).eq('id', user.id);

	return { predictionId: prediction.id };
}

export async function finalizeEnhancement(
	predictionId: string,
	generationId: string,
): Promise<{ newImageUrl: string; newGenerationId: string }> {
	const prediction = await replicate.predictions.get(predictionId);

	if (prediction.status !== "succeeded" || !prediction.output) {
		console.error(`[finalizeEnhancement] Prediction failed. status=${prediction.status}, output=`, prediction.output);
		throw new Error("Prediction failed or incomplete");
	}

	// Handle different output formats: could be a string URL, an array of URLs, or an object
	let outputUrl: string;
	if (typeof prediction.output === "string") {
		outputUrl = prediction.output;
	} else if (Array.isArray(prediction.output) && prediction.output.length > 0) {
		outputUrl = prediction.output[0];
	} else {
		console.error(`[finalizeEnhancement] Unexpected output format:`, prediction.output);
		throw new Error("Unexpected output format from model");
	}

	console.log(`[finalizeEnhancement] outputUrl: ${outputUrl.substring(0, 80)}...`);

	// Fetch and process new image
	const response = await fetch(outputUrl);
	if (!response.ok) {
		console.error(`[finalizeEnhancement] fetch failed: ${response.status} ${response.statusText}`);
		throw new Error(`Failed to fetch enhanced image: ${response.status}`);
	}
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;

	// Create a NEW generation record for the enhancement
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	const { data: newGeneration, error } = await supabase.from('Generation').insert({
		userId: authUser?.id, // Assign to current user
		prompt: `Enhanced: ${(prediction.input as any).prompt || "Enhanced Image"}`,
		style: "enhanced",
		originalImage: base64,
		blurredImage: base64, // Unlocked by default as they paid 10 credits
		status: "COMPLETED",
		cost: 10,
		unlocked: true,
	}).select().single();

	if (error) throw error;

	return { newImageUrl: base64, newGenerationId: newGeneration.id };
}

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(
	formData: FormData,
): Promise<{ predictionId: string }> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	let userId: string | null = null;

	if (authUser) {
		userId = authUser.id;
		let { data: user } = await supabase.from('user').select('*').eq('id', userId).single();

		if (!user) {
			const { data: newUser, error } = await supabase.from('user').insert({
				id: authUser.id,
				email: authUser.email!,
				name: authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
				credits: 0,
			}).select().single();
			if (error) throw error;
			user = newUser;
		}

		if (user.credits < 30) {
			throw new Error("Insufficient credits");
		}
	}

	const file = formData.get("image") as File;
	const style = formData.get("style") as string;

	if (!file) throw new Error("No image provided");

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");
	const dataUri = `data:${file.type};base64,${base64}`;

	let prompt = "";
	if (style === "formal") {
		prompt =
			"A professional vertical headshot of the same person from the input image, but a different photo. Formal business attire, clean neutral background, soft professional lighting, confident and composed expression. Maintain realistic skin texture and natural facial details. Change clothing, background, lighting and pose compared to the original image. Avoid recreating the original framing. No particles, no artifacts, no distortions, no over-smooth or plastic skin, no exaggerated colors, no lens flares, no text, no watermarks.";
	} else if (style === "smart-casual") {
		prompt =
			"### SEGMENT 1: IDENTITY & RADIANCE (The Lock-In) ### (masterpiece, best quality:1.2), high-end editorial portrait of [INPUT_IMAGE], identical facial structure preserved, (flawless skin texture:1.1), clean complexion, well-groomed hair with professional shine, (retaining original makeup, eyeliner, and lip color:1.3), soft focused eyes, ### SEGMENT 2: SMART FEMININE ATTIRE (The Style) ### (wearing sophisticated feminine professional attire:1.3), (high-quality silk blouse in neutral tones) OR (elegant mock-neck fine-knit sweater) OR (tailored feminine blazer with soft lapels), refined fabric textures, non-restrictive elegant silhouette, (minimalist professional jewelry:0.8), polished modern corporate aesthetic, ### SEGMENT 3: FRAMING & SOFTNESS ### upper body shot, chest-up framing, confident and approachable posture, looking at camera, (soft professional smile:0.9), hands out of frame,  ### SEGMENT 4: TECH-SMOOTH ENVIRONMENT ### (clean contemporary studio background with soft gradients:1.2), (natural diffused side-lighting:1.3), gentle shadows, high-end bokeh effect, depth of field, 8k resolution, photorealistic, sharp focus on facial features, professional color grading with subtle warmth.";
	} else if (style === "creative") {
		prompt =
			"A creative vertical portrait of the same person from the input image, but clearly a different photo. Modern creative style with subtle color accents or interesting lighting, artistic but still realistic. Contemporary background, expressive yet natural look. Keep the same facial identity with authentic skin texture. Change pose, lighting, clothing and background from the original image. Avoid particles, visual noise, glitches, plastic skin, surreal elements, text or watermarks.";
	} else {
		// Fallback
		prompt =
			"A professional vertical headshot of the same person from the input image. Professional business attire, clean neutral background, soft professional lighting, confident expression. Maintain realistic skin texture and natural facial details. No particles, no artifacts, no distortions, no text, no watermarks.";
	}

	const prediction = await replicate.predictions.create({
		version: "google/nano-banana",
		model: "google/nano-banana",
		input: {
			prompt: prompt,
			image_input: [dataUri],
			output_format: "jpg",
		},
	});

	return { predictionId: prediction.id };
}

export async function checkGenerationStatus(
	predictionId: string,
): Promise<{ status: string; output?: any; error?: any }> {
	const prediction = await replicate.predictions.get(predictionId);

	if (prediction.status === "succeeded") {
		return { status: "succeeded", output: prediction.output };
	} else if (prediction.status === "failed") {
		return { status: "failed", error: prediction.error };
	} else {
		return { status: prediction.status };
	}
}

export async function finalizeGeneration(
	predictionId: string,
	outputUrl: string,
): Promise<{ generationId: string; blurredImage: string }> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	const userId = authUser ? authUser.id : null;

	const response = await fetch(outputUrl);
	const arrayBuffer = await response.arrayBuffer();
	const originalBuffer = Buffer.from(arrayBuffer);

	const blurredBuffer = await sharp(originalBuffer)
		.resize(800)
		.blur(20)
		.toBuffer();

	const originalBase64 = `data:image/jpeg;base64,${originalBuffer.toString("base64")}`;
	const blurredBase64 = `data:image/jpeg;base64,${blurredBuffer.toString("base64")}`;

	const { data: generation, error } = await supabase.from('Generation').insert({
		userId: userId,
		prompt: "Generated via Replicate",
		style: "unknown",
		originalImage: originalBase64,
		blurredImage: blurredBase64,
		status: "COMPLETED",
		cost: 30,
		unlocked: false,
	}).select().single();

	if (error) throw error;

	return {
		generationId: generation.id,
		blurredImage: blurredBase64,
	};
}

export async function unlockImage(
	generationId: string,
): Promise<{ originalImage: string | null }> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) throw new Error("Unauthorized");

	const { data: user } = await supabase.from('user').select('*').eq('id', authUser.id).single();

	if (!user) {
		throw new Error(
			`User profile not found in database.`,
		);
	}

	if (user.credits < 30) {
		throw new Error("Insufficient credits");
	}

	const { data: generation, error } = await supabase.from('Generation').select('*').eq('id', generationId).single();

	if (error || !generation) {
		throw new Error("Generation not found");
	}

	// If generation has no user, claim it.
	// If generation has user, must match current user.
	if (generation.userId && generation.userId !== user.id) {
		throw new Error("Generation not found");
	}

	await supabase.from('user').update({ credits: user.credits - 30 }).eq('id', user.id);
	await supabase.from('Generation').update({
		unlocked: true,
		userId: user.id
	}).eq('id', generation.id);

	return { originalImage: generation.originalImage };
}

export async function addCreditsFromPayment(data: {
	userId: string;
	packageId: string;
	stripeSessionId: string;
	amount: number;
	currency: string;
	credits: number;
}): Promise<void> {
	// Webhooks require an admin client to bypass RLS when searching/updating users
	const supabaseAdmin = createAdminClient();

	//find existing transaction by stripeSessionId
	const { data: existingTransaction } = await supabaseAdmin.from('Transaction').select('*').eq('stripeSessionId', data.stripeSessionId).single();

	//idempotency check: if transaction already completed, skip processing
	if (existingTransaction && existingTransaction.status === "COMPLETED") {
		console.log(
			`Transaction ${data.stripeSessionId} already processed, skipping`,
		);
		return;
	}

	//if transaction doesn't exist, log error (shouldn't happen)
	if (!existingTransaction) {
		console.error(
			`Transaction not found for stripeSessionId: ${data.stripeSessionId}`,
		);
		throw new Error("Transaction not found");
	}

	const { data: user } = await supabaseAdmin.from('user').select('credits').eq('id', data.userId).single();
	if (!user) throw new Error("User not found");

	//update transaction status and add credits
	await supabaseAdmin.from('Transaction').update({ status: "COMPLETED" }).eq('id', existingTransaction.id);
	await supabaseAdmin.from('user').update({ credits: user.credits + data.credits }).eq('id', data.userId);
}

export async function buyCredits(
	packageId: string,
): Promise<{ checkoutUrl: string }> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) throw new Error("Unauthorized");

	//map package IDs to prices (in cents) and credits
	let amount = 0;
	let credits = 0;
	let stripeId = "";

	if (packageId === "entrepreneur") {
		amount = 200; //2€ in cents
		credits = 200;
		stripeId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTREPRENEUR || "";
	} else if (packageId === "startup") {
		amount = 600; //6€ in cents
		credits = 800; //750 + 50 bonus
		stripeId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTUP || "";
	} else if (packageId === "networking") {
		amount = 1500; //15€ in cents
		credits = 1700; //1600 + 100 bonus
		stripeId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_NETWORKING || "";
	} else {
		throw new Error("Invalid package ID");
	}

	//get base URL from request headers
	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol =
		headersList.get("x-forwarded-proto") ||
		(host.includes("localhost") ? "http" : "https");
	const baseUrl = `${protocol}://${host}`;

	//create transaction record immediately with PENDING status
	const { data: transaction, error: tError } = await supabase.from('Transaction').insert({
		userId: authUser.id,
		amount: amount,
		currency: "eur",
		status: "PENDING",
		credits: credits,
	}).select().single();

	if (tError) throw tError;

	try {
		// Construct line item dynamically based on whether it's a Price ID, Product ID, or neither
		let lineItem: any;

		if (stripeId.startsWith("price_")) {
			// If it's a Price ID, we just pass the price ID directly
			lineItem = {
				price: stripeId,
				quantity: 1,
			};
		} else if (stripeId.startsWith("prod_")) {
			// If it's a Product ID, we use price_data linked to that product
			lineItem = {
				price_data: {
					currency: "eur",
					product: stripeId,
					unit_amount: amount,
				},
				quantity: 1,
			};
		} else {
			// Fallback to ad-hoc product creation if keys are missing
			lineItem = {
				price_data: {
					currency: "eur",
					product_data: {
						name: `Credit Package: ${packageId}`,
					},
					unit_amount: amount,
				},
				quantity: 1,
			};
		}

		//create stripe checkout session
		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [lineItem],
			metadata: {
				userId: authUser.id,
				packageId: packageId,
				credits: credits.toString(),
			},
			success_url: `${baseUrl}?payment=success`,
			cancel_url: `${baseUrl}?payment=cancelled`,
		});

		//update transaction with stripeSessionId
		await supabase.from('Transaction').update({ stripeSessionId: checkoutSession.id }).eq('id', transaction.id);

		if (!checkoutSession.url) {
			throw new Error("Failed to create checkout session");
		}

		return { checkoutUrl: checkoutSession.url };
	} catch (error) {
		console.error("Error creating checkout session:", error);
		//if checkout session creation fails, we could optionally delete the transaction
		//but keeping it allows tracking of failed attempts
		throw new Error("Failed to create checkout session");
	}
}

export async function getUserGenerations(): Promise<
	{ id: string; image: string | null; unlocked: boolean }[]
> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) return [];

	const { data: generations } = await supabase.from('Generation')
		.select('*')
		.eq('userId', authUser.id)
		.eq('status', 'COMPLETED')
		.order('createdAt', { ascending: false })
		.limit(10);

	if (!generations) return [];

	return generations.map((g: any) => ({
		id: g.id,
		image: g.unlocked ? g.originalImage : g.blurredImage,
		unlocked: g.unlocked,
	}));
}

export async function getCredits(): Promise<number> {
	const supabase = await createClient();
	const {
		data: { user: authUser },
	} = await supabase.auth.getUser();

	if (!authUser) return 0;

	let { data: user } = await supabase.from('user').select('credits').eq('id', authUser.id).single();

	// Auto-sync Supabase user to DB if they don't exist
	if (!user) {
		const { data: newUser, error } = await supabase.from('user').insert({
			id: authUser.id,
			email: authUser.email!,
			name: authUser.user_metadata?.full_name || authUser.email!.split("@")[0],
			credits: 0,
		}).select().single();

		if (error) return 0;
		return newUser.credits;
	}

	return user.credits || 0;
}

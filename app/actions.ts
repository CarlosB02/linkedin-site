"use server";

import Replicate from "replicate";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";
import { revalidatePath } from "next/cache";

export async function enhanceImage(generationId: string, type: string): Promise<{ predictionId: string }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user || user.credits < 10) {
        throw new Error("Insufficient credits (10 required)");
    }

    const generation = await prisma.generation.findUnique({
        where: { id: generationId },
    });

    if (!generation || !generation.originalImage) {
        throw new Error("Generation not found");
    }

    // Construct prompt based on type
    let promptModification = "";
    switch (type) {
        case "Smile":
            promptModification = "smiling naturally, happy expression, approachable, professional headshot, preserve user appearance, preserve clothing";
            break;
        case "Open Eyes":
            promptModification = "eyes open naturally, attentive look, professional headshot, preserve user appearance, preserve clothing";
            break;
        case "Fix Lighting":
            promptModification = "perfect studio lighting, soft shadows, professional photography, high quality, preserve user appearance, preserve clothing";
            break;
        case "Background":
            promptModification = "modern professional office background, depth of field, blurred background, preserve user appearance, preserve clothing";
            break;
        case "Remove Background":
            promptModification = "solid white background, clean background, passport style photo, preserve user appearance, preserve clothing";
            break;
        default:
            promptModification = "high quality, professional headshot, preserve user appearance, preserve clothing";
    }

    const fullPrompt = `${promptModification}, ${generation.prompt || "Professional LinkedIn headshot"}`;

    const prediction = await replicate.predictions.create({
        version: "google/nano-banana", // Using the same model as requested
        model: "google/nano-banana",
        input: {
            prompt: fullPrompt,
            image_input: [generation.originalImage], // Pass existing image for img2img
            strength: 0.65, // Adjust strength to keep identity but apply changes. 1.0 = full replacement, 0.0 = no change.
            output_format: "jpg",
        },
    });

    // Deduct credits immediately or after success? 
    // Usually improved UX to deduct on initiation but refund on failure. 
    // For simplicity, we deduct here.
    await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 10 } },
    });

    return { predictionId: prediction.id };
}

export async function finalizeEnhancement(predictionId: string, generationId: string): Promise<{ newImageUrl: string; newGenerationId: string }> {
    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status !== "succeeded" || !prediction.output) {
        throw new Error("Prediction failed or incomplete");
    }

    const outputUrl = prediction.output[0] || prediction.output; // Handle array or string output

    // Fetch and process new image
    const response = await fetch(outputUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    // Create a NEW generation record for the enhancement
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const newGeneration = await prisma.generation.create({
        data: {
            userId: session?.user.id, // Assign to current user
            prompt: `Enhanced: ${((prediction.input as any).prompt) || "Enhanced Image"}`,
            style: "enhanced",
            originalImage: base64,
            blurredImage: base64, // Unlocked by default as they paid 10 credits
            status: "COMPLETED",
            cost: 10,
            unlocked: true,
            createdAt: new Date(),
        },
    });

    return { newImageUrl: base64, newGenerationId: newGeneration.id };
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

interface Generation {
    id: string;
    originalImage: string | null;
    blurredImage: string | null;
    unlocked: boolean;
}

export async function generateImage(formData: FormData): Promise<{ predictionId: string }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let userId: string | null = null;

    if (session) {
        userId = session.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (user && user.credits < 30) {
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
        prompt = "A professional vertical headshot of the same person from the input image, but a different photo. Formal business attire, clean neutral background, soft professional lighting, confident and composed expression. Maintain realistic skin texture and natural facial details. Change clothing, background, lighting and pose compared to the original image. Avoid recreating the original framing. No particles, no artifacts, no distortions, no over-smooth or plastic skin, no exaggerated colors, no lens flares, no text, no watermarks.";
    } else if (style === "smart-casual") {
        prompt = "A vertical smart-casual headshot of the same person from the input image, but not the same photo. Smart-casual clothing, modern clean background, soft natural lighting, friendly and professional expression. Slightly different head angle or pose. Keep facial identity consistent with realistic skin texture. Avoid copying the original photo’s clothing, background, lighting or pose. No particles, no artifacts, no distortion, no plastic skin, no exaggerated saturation, no text, no watermarks.";
    } else if (style === "creative") {
        prompt = "A creative vertical portrait of the same person from the input image, but clearly a different photo. Modern creative style with subtle color accents or interesting lighting, artistic but still realistic. Contemporary background, expressive yet natural look. Keep the same facial identity with authentic skin texture. Change pose, lighting, clothing and background from the original image. Avoid particles, visual noise, glitches, plastic skin, surreal elements, text or watermarks.";
    } else {
        // Fallback
        prompt = "A professional vertical headshot of the same person from the input image. Professional business attire, clean neutral background, soft professional lighting, confident expression. Maintain realistic skin texture and natural facial details. No particles, no artifacts, no distortions, no text, no watermarks.";
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

export async function checkGenerationStatus(predictionId: string): Promise<{ status: string; output?: any; error?: any }> {
    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === "succeeded") {
        return { status: "succeeded", output: prediction.output };
    } else if (prediction.status === "failed") {
        return { status: "failed", error: prediction.error };
    } else {
        return { status: prediction.status };
    }
}

export async function finalizeGeneration(predictionId: string, outputUrl: string): Promise<{ generationId: string; blurredImage: string }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session ? session.user.id : null;

    const response = await fetch(outputUrl);
    const arrayBuffer = await response.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    const blurredBuffer = await sharp(originalBuffer)
        .resize(800)
        .blur(20)
        .toBuffer();

    const originalBase64 = `data:image/jpeg;base64,${originalBuffer.toString("base64")}`;
    const blurredBase64 = `data:image/jpeg;base64,${blurredBuffer.toString("base64")}`;

    const generation = await prisma.generation.create({
        data: {
            userId: userId,
            prompt: "Generated via Replicate",
            style: "unknown",
            originalImage: originalBase64,
            blurredImage: blurredBase64,
            status: "COMPLETED",
            cost: 30,
            unlocked: false,
        },
    });

    return {
        generationId: generation.id,
        blurredImage: blurredBase64
    };
}

export async function unlockImage(generationId: string): Promise<{ originalImage: string | null }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        // User not found in DB, but session exists. Clean up.
        try {
            await prisma.session.deleteMany({
                where: { userId: session.user.id },
            });
            console.log(`Cleaned up sessions for missing user ${session.user.id} in unlockImage`);
        } catch (cleanupError) {
            console.error("Failed to clean up sessions:", cleanupError);
        }
        throw new Error(`User not found (ID: ${session.user.id}). Please log out and log in again.`);
    }

    if (user.credits < 30) {
        throw new Error("Insufficient credits");
    }

    const generation = await prisma.generation.findUnique({
        where: { id: generationId },
    });

    if (!generation) {
        throw new Error("Generation not found");
    }

    // If generation has no user, claim it.
    // If generation has user, must match current user.
    if (generation.userId && generation.userId !== user.id) {
        throw new Error("Generation not found");
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 30 } },
        }),
        prisma.generation.update({
            where: { id: generationId },
            data: {
                unlocked: true,
                userId: user.id // Ensure it's assigned
            },
        }),
    ]);

    return { originalImage: generation.originalImage };
}

export async function buyCredits(packageId: string): Promise<{ success: boolean }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    let creditsToAdd = 0;
    if (packageId === "entrepreneur") creditsToAdd = 200;
    if (packageId === "friends") creditsToAdd = 800; // 750 + 50 bonus
    if (packageId === "networking") creditsToAdd = 1700; // 1600 + 100 bonus

    console.log("Attempting to buy credits for User ID:", session.user.id);

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { increment: creditsToAdd } },
        });
    } catch (error: any) {
        console.error("Buy credits error:", error);
        throw Error("Failed to buy credits");
    }

    return { success: true };
}

export async function getUserGenerations(): Promise<{ id: string; image: string | null; unlocked: boolean }[]> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    const generations = await prisma.generation.findMany({
        where: { userId: session.user.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    return generations.map((g: Generation) => ({
        id: g.id,
        image: g.unlocked ? g.originalImage : g.blurredImage,
        unlocked: g.unlocked,
    }));
}

export async function getCredits(): Promise<number> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return 0;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
    });

    return user?.credits || 0;
}

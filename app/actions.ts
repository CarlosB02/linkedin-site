"use server";

import Replicate from "replicate";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";

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

        if (user && user.credits < 3) {
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

    let prompt = "Professional LinkedIn headshot, high quality, 8k";
    if (style === "formal") {
        prompt += ", wearing a formal suit and tie, studio lighting, solid background";
    } else if (style === "casual-formal") {
        prompt += ", wearing a quarter-zip sweater with a collared shirt underneath, smart casual, modern office background";
    } else if (style === "casual") {
        prompt += ", wearing casual but professional attire, relaxed atmosphere, blurred natural background";
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
            cost: 3,
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

    if (user.credits < 3) {
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
            data: { credits: { decrement: 3 } },
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

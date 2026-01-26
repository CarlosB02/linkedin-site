import { PrismaClient } from "@prisma/client";
import path from "path";

const prismaClientSingleton = () => {
	// Force absolute path to avoid CWD issues with SQLite
	const dbPath = path.join(process.cwd(), "prisma", "dev.db");
	const dbUrl = `file:${dbPath}`;

	console.log("Prisma Client initializing with URL:", dbUrl);

	return new PrismaClient({
		datasources: {
			db: {
				url: dbUrl,
			},
		},
	});
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

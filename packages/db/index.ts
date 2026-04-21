import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const createPrisma = (databaseUrl: string) => {
	return new PrismaClient({ accelerateUrl: databaseUrl }).$extends(withAccelerate())
}
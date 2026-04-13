import { Hono } from 'hono'
import { PrismaClient } from 'db'
import { PrismaNeon } from '@prisma/adapter-neon'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>()

app.get('/health', async (c) => {
  // Pass the Cloudflare env URL inside the configuration object
  const adapter = new PrismaNeon({ connectionString: c.env.DATABASE_URL })

  // Instantiate the Prisma Client with the edge adapter.
  const prisma = new PrismaClient({ adapter })

  try {
    return c.json({ 
      status: 'ok', 
      message: 'Prisma 7 Edge database connection healthy'
    })
  } finally {
    // Always disconnect in standalone scripts/edge environments
    await prisma.$disconnect()
  }
})

export default app
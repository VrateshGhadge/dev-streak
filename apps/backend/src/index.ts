import { Hono } from 'hono'
import { createPrisma } from '@repo/db'

type CloudflareBindings = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/health', (c) => {
  return c.json({
    status: 'ok'
  })
})

app.get('/health/db', async (c) => {
  const prisma = createPrisma(c.env.DATABASE_URL)

  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'ok', db: 'reachable' })
  } finally {
    await prisma.$disconnect()
  }
})

export default app
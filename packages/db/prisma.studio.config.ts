import { config as loadEnv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const thisDir = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: resolve(thisDir, '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})

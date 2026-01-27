import {prisma} from '@/lib/prisma'
import 'dotenv/config'
import {exec, execSync} from 'node:child_process'
import {randomInt, randomUUID} from 'node:crypto'
import {cp} from 'node:fs'
import type {Environment} from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // criar banco de testes

    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    console.log('DATABASE_URL', databaseUrl)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      teardown: async () => {
        // deletar banco de testes
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
        )
        await prisma.$disconnect()
      },
    }
  },
}

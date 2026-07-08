import 'dotenv/config'
import {PrismaClient} from '../src/generated/prisma/client'
import {PrismaPg} from '@prisma/adapter-pg'
import {randomUUID} from 'node:crypto'
import {execSync} from 'node:child_process'

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

export const schemaId = randomUUID()

let prisma: PrismaClient

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL
  process.env.DATABASE_SCHEMA = schemaId

  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: generateUniqueDatabaseURL(schemaId),
    }),
  })

  execSync('npx prisma migrate deploy', {env: process.env})
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})

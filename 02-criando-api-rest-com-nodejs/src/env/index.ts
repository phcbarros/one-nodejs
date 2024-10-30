import {config} from 'dotenv'
import {z} from 'zod'

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
  console.log('test aqui')
  config({path: '.env.test', override: true})
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

console.log('data', _env.data)
export const env = _env.data

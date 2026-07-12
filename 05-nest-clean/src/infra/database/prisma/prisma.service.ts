import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '@/generated/prisma/client'
import {EnvService} from '@/infra/env/env.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private env: EnvService) {
    const databaseUrlRaw = env.get('DATABASE_URL')
    const databaseSchema = env.get('DATABASE_SCHEMA')

    if (!databaseUrlRaw) {
      throw new Error(
        'DATABASE_URL não foi encontrada nas variáveis de ambiente.',
      )
    }

    // Fix caused by prisma 7.2.0 update
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const databaseURL = new URL(databaseUrlRaw)

    const adapter = new PrismaPg(
      {connectionString: databaseURL.toString()},
      {schema: databaseSchema || 'public'},
    )

    super({
      adapter,
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}

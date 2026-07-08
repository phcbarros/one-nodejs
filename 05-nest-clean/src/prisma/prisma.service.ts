import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '@/generated/prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    const databaseUrlRaw = config.get('DATABASE_URL', {infer: true})
    const databaseSchema = config.get('DATABASE_SCHEMA', {infer: true})

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

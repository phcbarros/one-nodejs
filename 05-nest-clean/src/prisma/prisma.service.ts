import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '@/generated/prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const databaseUrlRaw = configService.get<string>('DATABASE_URL')

    if (!databaseUrlRaw) {
      throw new Error(
        'DATABASE_URL não foi encontrada nas variáveis de ambiente.',
      )
    }

    // Fix caused by prisma 7.2.0 update
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const databaseURL = new URL(databaseUrlRaw)
    const schema = databaseURL.searchParams.get('schema')

    const adapter = new PrismaPg(
      {connectionString: databaseURL.toString()},
      {schema: schema || 'public'},
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

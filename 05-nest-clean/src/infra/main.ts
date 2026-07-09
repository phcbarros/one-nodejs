import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {ConfigService} from '@nestjs/config'
import {Env} from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // informa ao nest que as env vars foram validadas passando true no segundo argumento
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', {infer: true})

  await app.listen(port)
}
bootstrap()

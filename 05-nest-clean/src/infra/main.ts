import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {EnvService} from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // informa ao nest que as env vars foram validadas passando true no segundo argumento
  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()

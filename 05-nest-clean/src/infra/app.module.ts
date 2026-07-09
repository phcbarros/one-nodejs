import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {envSchema} from './env'
import {AuthModule} from './auth/auth.module'
import {HttpModuleModule} from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModuleModule,
  ],
})
export class AppModule {}

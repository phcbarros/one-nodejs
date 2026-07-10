import {Module} from '@nestjs/common'
import {BcryptHasher} from './bcrypt-hasher'
import {JwtEncrypter} from './jwt-encrypter'
import {INJECTION_ENCRYPTER} from '@/domain/constants/injections/encrypter.constants'
import {
  INJECTION_HASHER_COMPARER,
  INJECTION_HASHER_GENERATOR,
} from '@/domain/constants/injections/hash.constants'
import {ENCRYPTER} from '@/domain/forum/application/cryptography/encrypter'
import {HASHER_COMPARER} from '@/domain/forum/application/cryptography/hash-comparer'
import {HASHER_GENERATOR} from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: ENCRYPTER,
      useClass: JwtEncrypter,
    },
    {
      provide: HASHER_COMPARER,
      useClass: BcryptHasher,
    },
    {
      provide: HASHER_GENERATOR,
      useClass: BcryptHasher,
    },
  ],
  exports: [ENCRYPTER, HASHER_COMPARER, HASHER_GENERATOR],
})
export class CryptographyModule {}

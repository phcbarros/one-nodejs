export const HASHER_GENERATOR = Symbol('HASH_GENERATOR')

export interface HashGenerator {
  hash(plain: string): Promise<string>
}

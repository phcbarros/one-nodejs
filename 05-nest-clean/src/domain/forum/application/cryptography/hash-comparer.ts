export const HASHER_COMPARER = Symbol('HASH_COMPARER')

export interface HashComparer {
  compare(plain: string, hash: string): Promise<boolean>
}

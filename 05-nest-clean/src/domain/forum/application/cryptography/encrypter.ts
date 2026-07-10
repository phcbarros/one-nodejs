export const ENCRYPTER = Symbol('ENCRYPTER')

export interface Encrypter {
  encrypt(payload: Record<string, unknown>): Promise<string>
}

export class InMemoryUsersRepository {
  public users: unknown[] = []

  async create(data: unknown) {
    this.users.push(data)
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email)
  }
}

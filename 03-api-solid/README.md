# App

Gympass style app.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas até 10km;
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer dois check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisa estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);

## Emoji mac

command + control + space

## Prisma

```shell
npx prisma init

# criar de forma automática a tipagem do schema
npx prisma generate

# executar migration
npx prisma migrate dev

npx prisma studio
```

## Banco

```shell
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5432:5432 bitnami/postgresql

docker start api-solid-pg

docker stop api-solid-pg

docker logs api-solid-pg -f

# compose
docker compose up -d

docker compose stop

# deleta o container
docker compose down --remove-orphans
```

## Autenticação

### Basic Auth

Em toda a request o usuário precisa informar as credenciais como cabeçalho na requisição

```txt
Authorization: Basic { credencias em base 64 no formato usuário:senha }
```

- Não é 100 % seguro mesmo usando TLS

### JWT - JSON WEB TOKEN

Diferente da Basic Auth, quando o usuário faz login na rota de login, o backend valida o email e senha, então um token **ÚNICO** e não modificável é gerado (stateless token).

Usuário faz login, envia e-mail/senha, o back-end cria um token **ÚNICO** e não modificável e STATELESS

Stateless: não armazenado em nenhuma estrutura de persistência de dados (bando de dados);

Back-end: Quando vai criar o token ele usa uma PALAVRA-CHAVE (string); somente o back-end consegue criptografar/descriptografar o token com base na palavra-chave

Palavra-chave: dfaeljeqpernqnmdfewopqelfnajeqweprfpjkerqpjrpq

E-mail/senha -> header.payload.sign
Payload: qualquer informação que eu quiser (sub = id do usuário)

Login => JWT
JWT => Todas requisições dali para frente
Header (cabeçalho): Authorization: Bearer JWT

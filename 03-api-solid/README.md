# API SOLID Node.js

API de uma aplicação no estilo GymPass desenvolvida em Node.js com TypeScript, Fastify e Prisma, seguindo os princípios SOLID para um código limpo, escalável e de fácil manutenção.

## Principais Funcionalidades da Aplicação

- **Usuários (Users):** Podem se cadastrar, autenticar e visualizar seus perfis.
- **Academias (Gyms):** Podem ser cadastradas, buscadas por nome ou proximidade.
- **Check-ins:** Usuários podem realizar check-in em academias, com regras de negócio como validação de distância e limite de check-ins por dia.

## Tecnologias Utilizadas

- **Node.js:** Ambiente de execução do JavaScript no servidor.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Fastify:** Framework web focado em performance e baixo overhead.
- **Prisma:** ORM para Node.js e TypeScript, utilizado para a comunicação com o banco de dados (PostgreSQL).
- **Zod:** Biblioteca para validação de esquemas e tipos.
- **Vitest:** Framework de testes para projetos Vite (e Node.js).
- **Docker:** Utilizado para criar um ambiente de desenvolvimento com PostgreSQL.
- **TSX:** Executa arquivos TypeScript diretamente sem a necessidade de compilação prévia em desenvolvimento.
- **TSUP:** Bundler para bibliotecas TypeScript.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

## Emoji mac

command + control + space

## Prisma

```shell
npx prisma init

# criar de forma automática a tipagem do schema
npx prisma generate

# executar migration
npx prisma migrate dev

# executar prisma studio
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

### RBAC - Role Based Authorization Control

Controle de autorização com base no cargo do usuário (admin, gestor, etc).

### CI - Continuous integration

Rotinas para integração de código de forma continua que podem validar se o código integrado está atendendo as regras do time

### CD - Continuous Deployment/Delivery

Process de receber um novo código e automaticamente efetuar o Deploy da aplicação

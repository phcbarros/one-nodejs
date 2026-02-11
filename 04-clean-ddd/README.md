# Domain Driven Design (DDD)

Design dirigido à domínio

Como converter o problema do cliente em Software
Design de Software é diferente de Arquitetura de Software

- Não tem nada a haver com arquitetura
- Não tem nada a haver com separação de pastas
- Não tem nada a haver com linguagem de programação
- Não tem nada a haver com camadas
- Não tem nada a haver com tabelas no banco de dados

## Domínio

- Domain Experts
- Conversa

- Linguagem ubíqua
- Linguagem universal das pessoas envolvidas no problema

- Agregados
- Value Objects
- Eventos de domínio
- Subdomínios (Bounded Contexts)
- Entidades
- Casos de uso

## Clean Architecture

- Principal conceito é a proteção entre as camadas e não a forma como isso será representado dentro do código
- Não define nome ou organização de pastas
- A camada mais interna nunca pode depender da camada mais externa

### Frameworks and drivers (Devices, WEB, DB, External Interfaces, UI)

- Camada mais externa da aplicação, a forma da aplicação se comunicar com o mundo externo (DB, Queue, Cache, WEB)
- Camada de infra estrutura

### Interface adapters (Controllers, Gateways, Presenters)

- Camada que vai adaptar a informação que vem da camada de Frameworks and drivers
- Proteger a camada mais interna da implementação (os casos de uso) direta da camada de infraestrutura (Dependency Inversion)

### Use cases (Application Business Rules)

### Entities (Enterprise Business Rules)

- Nunca deve saber os detalhes da implementação
- Facilidade de mudar de frameworks sem precisar alterar o código das camadas
- Isolado da camada de infraestrutura

## Criando o projeto

```shell
npm init -y

npm i typescript @types/node -D

npx tsc --init
```

## Lint

```shell
npm run lint

npm run lint:fix
```

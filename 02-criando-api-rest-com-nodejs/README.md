#

## Migrations

Ferramenta usada [knex](https://knexjs.org/guide/)

### Criar

```shell
npm run knex -- migrate:make nome-migrate
```

### Aplicar

```shell
npm run knex -- migrate:latest
```

### Reverter

```shell
npm run knex -- migrate:rollback
```

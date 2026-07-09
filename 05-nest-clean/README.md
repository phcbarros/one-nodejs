Chave private e publica do JWT foram geradas no site

https://cryptotools.net/rsagen

## Prisma Studio

```shell
npx prisma studio --url="postgresql://postgres:docker@localhost:5432/nest-clean"
```

## Infra

Responsável pelas camadas Framework & drivers e Interface Adapters (controllers, repositories)

### Mapper

Mappers são classes responsáveis por converter uma entidade em um formato de uma camada para o formato de outra camada. `Por exemplo, a`Question`do`banco de dados`é tem o formato diferente do formato da`Question`da camada de`domínio` mesmo elas representando uma Question.

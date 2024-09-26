Executar projeto

```shell
npm run dev
```

## Query params

GET http://localhost:3333/users?search=Lucas
URL Stateful => filtros, paginação
dados que modificam a resposta do backend, com dados não sensíveis e não obrigatórios
exposto na url

## Route params

GET http://localhost:3333/users/1
Params não nomeados => Identificação de recurso
dados não sensíveis
exposto na url

## Request body

POST http://localhost:3333/users
{ name: 'Lucas' }
Envio de informações de um formulário (HTTPS)

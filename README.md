# one-nodejs

Projetos do repo são dos cursos Rocketseat`

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

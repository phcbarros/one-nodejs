import {FastifyReply, FastifyRequest} from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({onlyCookie: true})

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/', // quais rotas terão acesso ao cookie (/ significa todas as rotas)
      secure: true, // só envia o cookie em conexões https
      sameSite: true, // aceita o cookie somente do mesmo domínio
      httpOnly: true, // não permite acesso ao cookie via javascript (document.cookie)
    })
    .status(200)
    .send({
      token,
    })
}

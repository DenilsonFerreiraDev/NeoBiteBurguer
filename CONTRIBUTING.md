# Contribuindo com o NeoBite Burgers

Obrigado por contribuir com o NeoBite Burgers. Este guia descreve o fluxo esperado para alterações de código, banco e documentação.

## Antes de começar

- Leia o [`README.md`](README.md) e [`docs/DATABASE.md`](docs/DATABASE.md).
- Use Node.js 20 ou superior.
- Nunca compartilhe chaves, tokens, senhas ou arquivos `.env`.
- Não desative o RLS para facilitar o desenvolvimento.

## Configuração local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` apenas com as variáveis públicas necessárias para o cliente local. Valores privados devem permanecer nas variáveis protegidas do ambiente de desenvolvimento ou hospedagem.

## Fluxo de trabalho

1. Crie uma branch a partir da branch principal.
2. Faça uma alteração pequena e focada.
3. Preserve o design cyberpunk, a acessibilidade e o comportamento existente.
4. Atualize a documentação quando alterar autenticação, permissões, RPCs ou schema.
5. Abra um pull request descrevendo o problema, a solução e os testes executados.

Não envie commits diretamente para a branch principal.

## Banco de dados e Supabase

Alterações no banco devem:

- Ser reproduzíveis por migration.
- Usar validação no banco para regras críticas.
- Manter o RLS ativo.
- Restringir consultas por `user_id` quando os dados forem do usuário.
- Validar autorização administrativa com `public.is_admin()` e políticas RLS.
- Atualizar [`docs/DATABASE.md`](docs/DATABASE.md).

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`, senhas de banco ou tokens em código, commits, issues ou logs.

## Autenticação

Os fluxos de cadastro, login, logout, recuperação de senha e atualização de senha usam Supabase Auth. Alterações nesses fluxos devem verificar:

- Redirecionamentos de callback.
- Cookies e sessões server-side.
- Proteção de `/conta` e `/admin`.
- Mensagens de erro sem exposição de informações sensíveis.
- Confirmação de e-mail e recuperação de senha em ambiente local.

## Validação antes do pull request

Execute os comandos abaixo:

```bash
npm run lint
npm run build
```

Também teste manualmente as áreas afetadas no navegador. Para mudanças de autenticação ou autorização, teste tanto um usuário comum quanto um administrador e confirme que um usuário não consegue visualizar dados de outra conta.

## Mensagens de commit

Use mensagens claras e no imperativo, por exemplo:

- `Adiciona filtro de status aos pedidos`
- `Atualiza documentação do Supabase`
- `Corrige redirecionamento de recuperação de senha`

## Pull requests

Inclua:

- Resumo do problema e da solução.
- Rotas ou componentes afetados.
- Alterações de migration, se houver.
- Comandos de validação executados.
- Screenshots quando houver mudança visual.
- Observações sobre configuração ou variáveis de ambiente.

## Checklist

- [ ] A alteração está limitada ao escopo descrito.
- [ ] Nenhum segredo foi adicionado.
- [ ] Nenhum arquivo `.env` foi incluído.
- [ ] RLS e autorização server-side foram preservados.
- [ ] A documentação foi atualizada quando necessário.
- [ ] `npm run lint` passou.
- [ ] `npm run build` passou.
- [ ] O fluxo afetado foi testado no navegador.

## Relato de vulnerabilidades

Não publique credenciais ou detalhes exploráveis em issues públicas. Informe vulnerabilidades de forma privada aos responsáveis pelo repositório e revogue imediatamente qualquer segredo exposto.

## Licença

A licença do projeto deve ser definida pelos responsáveis antes da distribuição pública.

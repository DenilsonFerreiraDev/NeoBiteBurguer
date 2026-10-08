# NeoBite Burgers

Aplicação web cyberpunk para cardápio, checkout, autenticação de usuários e gestão administrativa de pedidos e produtos.

## Tecnologias utilizadas

- Next.js 16 com App Router
- React 19 e TypeScript
- Supabase Auth, PostgreSQL e Row Level Security (RLS)
- `@supabase/ssr` e `@supabase/supabase-js`
- Tailwind CSS 4
- shadcn/ui e Radix UI
- Lucide React para ícones
- Vercel Analytics

## Funcionalidades

### Cliente

- Visualização do cardápio e filtro por categoria
- Carrinho e checkout
- Formas de pagamento simuladas: Pix, cartão e pagamento na entrega
- Cadastro, login, logout e confirmação de e-mail
- Recuperação e atualização de senha
- Área do usuário em `/conta`
- Histórico dos próprios pedidos
- Avaliação de pedidos entregues

### Administração

- Dashboard em `/admin`
- Indicadores de pedidos, pedidos do dia, faturamento e avaliações
- Listagem e detalhes de pedidos
- Atualização do status: recebido, em preparo, em entrega e entregue
- Cadastro, edição, ativação/desativação e exclusão de produtos
- Proteção de rotas e autorização adicional por RLS no Supabase

> O pagamento é simulado. O projeto não realiza cobranças reais.

## Instalação local

### Pré-requisitos

- Node.js 20 ou superior
- npm, pnpm ou outro gerenciador compatível
- Um projeto Supabase

### Passos

```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>
npm install
cp .env.example .env.local
```

Preencha o `.env.local` com as credenciais públicas do Supabase e inicie o ambiente:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

Para verificar o projeto antes de publicar:

```bash
npm run lint
npm run build
```

Nunca envie `.env.local` ou qualquer outro arquivo `.env` para o Git. O arquivo `.env.example` contém apenas os nomes das variáveis necessárias.

## Estrutura do banco

O schema completo está documentado em [`docs/DATABASE.md`](docs/DATABASE.md). As principais tabelas são:

- `products`: catálogo, preço, imagem, ordem de exibição e flag de ativação.
- `orders`: pedidos, snapshot dos itens, total, forma de pagamento, status e usuário responsável.
- `reviews`: uma avaliação por pedido, com nota e comentário.
- `admin_users`: usuários autorizados a acessar o painel administrativo.

As tabelas usam RLS. O total do pedido é recalculado no banco a partir do preço atual do produto, e os itens são armazenados como snapshot para preservar o histórico da compra.

As funções RPC principais são `create_order`, `submit_review`, `admin_update_order_status` e `admin_dashboard_stats`.

## Como configurar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Aplique as migrations do projeto no SQL Editor ou pelo fluxo de migrations utilizado pela equipe.
3. No painel do Supabase, abra **Project Settings → API**.
4. Copie a URL do projeto e a chave pública para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
```

5. Em **Authentication → URL Configuration**, adicione `http://localhost:3000` às URLs permitidas. Configure também a URL de callback usada pelo ambiente publicado.
6. Em **Authentication → Email Templates**, confirme que o link de recuperação aponta para `/auth/update-password` através da URL de redirecionamento da aplicação.

Não coloque `service_role`, `secret`, senha do banco ou JWT secret em variáveis `NEXT_PUBLIC_*`, no código ou no GitHub. O cliente da aplicação deve usar somente a URL e a chave pública.

## Como criar um usuário administrador

1. Cadastre o usuário em `/auth/sign-up` e confirme o e-mail.
2. No Supabase, abra **SQL Editor**.
3. Execute o comando abaixo, trocando o e-mail:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@exemplo.com'
on conflict (user_id) do nothing;
```

4. Faça login novamente e abra `/admin`.

Para remover o acesso administrativo:

```sql
delete from public.admin_users
where user_id = (
  select id from auth.users where email = 'admin@exemplo.com'
);
```

O acesso é validado no servidor e nas políticas RLS; esconder o link da interface não é a única camada de proteção.

## Documentação adicional

- [Banco de dados](docs/DATABASE.md)
- [Contribuição](CONTRIBUTING.md)
- [Política de segurança do Git](.gitignore)

## Licença

Defina a licença do projeto antes de distribuir o código publicamente.

## Autor

NeoBite Burgers.

## Aviso

Este README documenta o estado atual da aplicação. Atualize-o quando houver mudanças no schema, nos fluxos de autenticação ou nas permissões administrativas.

## Desenvolvimento

As alterações devem preservar a validação server-side, o isolamento por RLS e o design cyberpunk existente.

## Contato

Abra uma issue no repositório para relatar problemas ou propor melhorias.

## Status do projeto

Em desenvolvimento.

## Ambiente de produção

Configure as variáveis no provedor de hospedagem e mantenha as chaves privadas fora do cliente e do repositório.

## Segurança

Não desative o RLS em produção. Revise as políticas sempre que novas tabelas, RPCs ou fluxos de autenticação forem adicionados.

## Suporte

Consulte a documentação do Supabase e do Next.js para problemas de infraestrutura ou configuração.

## Histórico de pedidos

Pedidos associados a uma conta autenticada aparecem somente para o respectivo usuário. Pedidos criados antes da associação de usuários podem não aparecer no histórico.

## Observação sobre e-mail

O cadastro e a recuperação de senha dependem da configuração de e-mail do Supabase. Em produção, configure um provedor SMTP adequado.

## Finalidade

Projeto demonstrativo de uma hamburgueria com experiência visual cyberpunk e fluxo completo de compra.

## Contribuições

Leia [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de abrir uma alteração.

## Branch principal

Não envie alterações diretamente para a branch principal sem revisão.

## Código de conduta

Mantenha uma comunicação respeitosa, objetiva e colaborativa.

## Última atualização

Documentação alinhada ao painel administrativo, autenticação e histórico de pedidos atuais.

## Repositório

Consulte a URL oficial do projeto no provedor Git configurado.

## Fim

Obrigado por contribuir com o NeoBite Burgers.

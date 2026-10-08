🍔 NeoBite Burguer
Aplicação Full Stack desenvolvida com Next.js, TypeScript e Supabase, simulando uma plataforma moderna de pedidos online com identidade visual cyberpunk.

A NeoBite começou como um protótipo acadêmico e evoluiu para uma aplicação completa com autenticação, persistência de dados, painel administrativo e gerenciamento de pedidos.

🚀 Demonstração
🔗 Aplicação Online:

https://v0-app-de-hamburgueria-futurista.vercel.app/

📸 Screenshots
Página Inicial
Adicione aqui uma captura da landing page.

Cardápio
Adicione aqui uma captura do cardápio.

Área do Usuário
Adicione aqui uma captura da página /conta.

Painel Administrativo
Adicione aqui uma captura da página /admin.

✨ Funcionalidades
Cliente
✅ Cardápio dinâmico integrado ao Supabase

✅ Carrinho de compras

✅ Checkout completo

✅ Cadastro de usuários

✅ Login e logout

✅ Recuperação de senha

✅ Histórico de pedidos

✅ Avaliação de pedidos

✅ Controle de sessão

✅ Exibição do status dos pedidos

Administração
✅ Dashboard administrativo

✅ Indicadores de pedidos

✅ Faturamento total

✅ Gestão de produtos

✅ Cadastro de produtos

✅ Edição de produtos

✅ Exclusão de produtos

✅ Ativação/desativação de produtos

✅ Gestão de pedidos

✅ Alteração de status

✅ Controle de acesso administrativo

Segurança
✅ Supabase Auth

✅ Row Level Security (RLS)

✅ Proteção de rotas privadas

✅ Controle de permissões

✅ Associação segura entre usuários e pedidos

✅ Recalculo dos pedidos no servidor

✅ Proteção contra pedidos duplicados

⚠️ Os pagamentos são simulados para fins educacionais. Nenhuma cobrança real é realizada.

🏗️ Arquitetura
Frontend
│
├── Next.js
├── React
├── TypeScript
├── Tailwind CSS
└── shadcn/ui

Backend
│
└── Supabase

Banco de Dados
│
└── PostgreSQL

Autenticação
│
└── Supabase Auth

Hospedagem
│
└── Vercel
🛠️ Tecnologias Utilizadas
Frontend
Next.js 16
React 19
TypeScript
Tailwind CSS 4
shadcn/ui
Radix UI
Lucide React
Backend
Supabase
PostgreSQL
Autenticação
Supabase Auth
Segurança
Row Level Security (RLS)
Monitoramento
Vercel Analytics
🔄 Fluxo do Sistema
Cliente
Cadastro
↓
Login
↓
Cardápio
↓
Carrinho
↓
Checkout
↓
Pedido Registrado
↓
Avaliação
↓
Histórico de Pedidos
Administrador
Login
↓
Painel Administrativo
↓
Dashboard
↓
Gestão de Produtos
↓
Gestão de Pedidos
↓
Atualização de Status
📦 Instalação Local
Pré-requisitos
Node.js 20+
npm ou pnpm
Conta no Supabase
Clonar o projeto
git clone https://github.com/DenilsonFerreiraDev/NeoBiteBurguer.git

cd NeoBiteBurguer
Instalar dependências
npm install
Configurar variáveis de ambiente
Crie um arquivo:

.env.local
Utilizando como base:

.env.example
Exemplo:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
Executar aplicação
npm run dev
Acesse:

http://localhost:3000
✅ Build de Produção
npm run lint

npm run build
🗄️ Banco de Dados
Principais tabelas:

products
Responsável pelo catálogo de produtos.

orders
Responsável pelo registro dos pedidos.

reviews
Responsável pelas avaliações.

admin_users
Responsável pelo controle de administradores.

👨‍💼 Criando Administradores
Após criar e confirmar uma conta:

insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@exemplo.com'
on conflict (user_id) do nothing;
Após realizar novo login:

/conta
↓
Admin
📁 Estrutura do Projeto
app/
├── admin/
├── auth/
│   ├── login/
│   ├── sign-up/
│   ├── forgot-password/
│   └── update-password/
│
├── conta/
├── layout.tsx
└── page.tsx

components/
├── neobite/
└── ui/

docs/
├── DATABASE.md
└── admin.md
🔐 Boas Práticas de Segurança
Nunca enviar arquivos .env
Nunca expor Service Role Keys
Nunca expor senhas do banco
Manter RLS habilitado
Utilizar apenas a chave pública no frontend
Ativar Secret Scanning no GitHub
🗺️ Roadmap Futuro
Integração com pagamentos reais
Cupons persistidos
Programa de fidelidade
Dashboard avançado
Notificações em tempo real
Rastreio de pedidos
Recomendações com IA
Aplicativo mobile
🎯 Objetivos do Projeto
Este projeto foi desenvolvido com foco em:

Desenvolvimento Full Stack
Next.js
TypeScript
Banco de Dados PostgreSQL
Autenticação
Segurança
Controle de Acesso
Arquitetura Web
Experiência do Usuário (UX)
👨‍💻 Autor
Antonio Denilson Ferreira Araujo

GitHub: https://github.com/DenilsonFerreiraDev

LinkedIn: ADICIONE_SEU_LINK

📄 Licença
Projeto desenvolvido para fins educacionais e demonstração de competências em desenvolvimento Full Stack.

⭐ Se este projeto foi interessante para você, considere deixar uma estrela no repositório.

# Área administrativa NeoBite

## Visão geral

A rota `/admin` dá aos administradores um painel para acompanhar métricas, gerenciar o cardápio e operar os pedidos. A interface segue a mesma identidade cyberpunk do restante do site (ciano `primary`, violeta `secondary`, glows neon, fundo escuro).

| Rota | Função |
| --- | --- |
| `/admin` | Dashboard: total de pedidos, pedidos hoje, faturamento total, avaliações recebidas (com média) e os 5 últimos pedidos |
| `/admin/produtos` | Lista de produtos (incluindo os ocultos) com editar/excluir |
| `/admin/produtos/novo` | Criar produto |
| `/admin/produtos/[id]` | Editar produto |
| `/admin/pedidos` | Lista dos 100 pedidos mais recentes com filtro por status |
| `/admin/pedidos/[id]` | Detalhes do pedido (itens, total, pagamento, avaliação) e alteração de status |

## Como tornar um usuário administrador

1. O usuário cria a conta normalmente em `/auth/sign-up` e confirma o e-mail.
2. No SQL Editor do Supabase, execute:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'admin@exemplo.com';
```

Para remover o acesso: `delete from public.admin_users where user_id = '<uuid>';`

Não há como um usuário se promover pela aplicação: a tabela `admin_users` só permite que cada usuário leia a própria linha.

## Segurança (camadas)

1. **Proxy** (`lib/supabase/proxy.ts`): `/admin` foi adicionado aos prefixos protegidos; visitantes sem sessão são redirecionados para `/auth/login?next=/admin`.
2. **Layout** (`app/admin/layout.tsx`): chama `requireAdmin()`, que valida a sessão e consulta `is_admin()`. Usuários logados que não são admin são redirecionados para `/conta`.
3. **Server Actions** (`lib/neobite/admin-actions.ts`): toda ação revalida o admin antes de executar e valida as entradas (nome, preço, URL `https`, ordem etc.).
4. **Banco (RLS)**: mesmo que as camadas acima falhem, as políticas só permitem escrita em `products` e leitura de todos os `orders`/`reviews` quando `public.is_admin()` é verdadeiro. A mudança de status é feita pela função `admin_update_order_status`, que também checa `is_admin()`.

## Alterações no banco (migração `neobite_admin_area`)

- Nova tabela `admin_users (user_id, created_at)` com RLS.
- Nova função `is_admin()` (`security definer`).
- Status de pedido passou a ser: `received` (Recebido), `preparing` (Em preparo), `out_for_delivery` (Em entrega), `delivered` (Entregue). `cancelled` continua válido para compatibilidade, mas não pode ser escolhido pelo painel.
- Pedidos antigos com status `confirmed` foram migrados para `received`, e o padrão de novos pedidos agora é `received`.
- Políticas `products_admin_*` (select/insert/update/delete), `orders_admin_select` e `reviews_admin_select`.
- Funções `admin_update_order_status(uuid, text)` e `admin_dashboard_stats()` (contagem de "hoje" usa o fuso `America/Sao_Paulo`; faturamento ignora cancelados).

## Arquivos

Novos:

- `lib/neobite/order-status.ts` — rótulos/estilos de status, formas de pagamento e formatadores compartilhados.
- `lib/neobite/admin.ts` — `requireAdmin`, `isCurrentUserAdmin` e consultas do painel.
- `lib/neobite/admin-actions.ts` — Server Actions de produtos e status.
- `app/admin/**` — páginas do painel.
- `components/admin/**` — header, navegação, cards de métricas, tabela de pedidos, badge de status, formulários e diálogo de exclusão.

Alterados (sem mudar comportamento existente):

- `lib/supabase/proxy.ts` — `/admin` incluído nas rotas protegidas.
- `lib/neobite/orders.ts` e `components/account/order-history.tsx` — passam a usar os novos status compartilhados, para o cliente ver o andamento do pedido no histórico.
- `components/account/account-header.tsx` e `app/conta/page.tsx` — botão "Admin" aparece na área do usuário apenas para administradores.

## Observações

- Excluir um produto o remove do cardápio, mas pedidos antigos mantêm uma cópia do item (nome, preço e imagem), então o histórico não é afetado. Para esconder temporariamente, desmarque "Visível no cardápio".
- Alterações no catálogo revalidam a página inicial na hora.

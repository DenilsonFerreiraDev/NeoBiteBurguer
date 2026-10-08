# NeoBite Burgers — Documentação do Banco de Dados (Supabase)

Migration aplicada: `neobite_initial_schema`

## Visão geral

| Tabela     | Finalidade                                   | Acesso pelo app                         |
| ---------- | -------------------------------------------- | --------------------------------------- |
| `products` | Catálogo de hambúrgueres exibido no cardápio | `SELECT` público (apenas `is_active`)   |
| `orders`   | Pedidos finalizados no checkout              | Somente via função `create_order`       |
| `reviews`  | Avaliações pós-pedido (1 por pedido)         | Somente via função `submit_review`      |

Todas as tabelas têm **Row Level Security** ativo. `orders` e `reviews` não possuem políticas
para `anon`/`authenticated`, então não podem ser lidas ou escritas diretamente pelo cliente —
toda escrita passa pelas funções `security definer`, que validam os dados no servidor.

## Diagrama

```
products (1) ──< (snapshot em orders.items, jsonb)
orders   (1) ──── (0..1) reviews   [reviews.order_id UNIQUE, ON DELETE CASCADE]
```

## Tabelas

### `public.products`

```sql
create table public.products (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  price       numeric(10,2) not null check (price > 0),
  image_url   text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index products_active_sort_idx on public.products (is_active, sort_order);

alter table public.products enable row level security;

create policy "products_public_read" on public.products
  for select to anon, authenticated using (is_active = true);
```

| Coluna        | Tipo          | Descrição                                     |
| ------------- | ------------- | --------------------------------------------- |
| `id`          | bigint        | Identificador (identity)                      |
| `name`        | text          | Nome do lanche                                |
| `description` | text          | Ingredientes / descrição                      |
| `price`       | numeric(10,2) | Preço em BRL (fonte da verdade para o total)  |
| `image_url`   | text          | URL da imagem do card                         |
| `is_active`   | boolean       | Oculta o produto do cardápio quando `false`   |
| `sort_order`  | integer       | Ordem de exibição no cardápio                 |
| `created_at`  | timestamptz   | Data de criação                               |

Seed: 6 produtos (CyberBacon, Quantum Burger, Neon Classic, Matrix Veggie, Turbo Chicken, Smash Classic).

### `public.orders`

```sql
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,
  items           jsonb not null,
  total           numeric(10,2) not null check (total > 0),
  payment_method  text not null check (payment_method in ('pix','card','delivery')),
  status          text not null default 'confirmed'
                  check (status in ('confirmed','preparing','delivered','cancelled')),
  created_at      timestamptz not null default now()
);

create index orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;
```

`items` guarda um snapshot imutável no momento da compra:

```json
[{ "product_id": 1, "name": "CyberBacon", "unit_price": 42.90, "quantity": 2, "image_url": "..." }]
```

### `public.reviews`

```sql
create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null unique references public.orders(id) on delete cascade,
  rating     smallint not null check (rating between 1 and 5),
  comment    text check (comment is null or char_length(comment) <= 1000),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
```

## Funções (RPC)

Ambas são `security definer` com `set search_path = ''` e `EXECUTE` concedido apenas a `anon` e `authenticated`.

### `public.create_order(p_items jsonb, p_payment_method text, p_idempotency_key uuid) returns uuid`

- Retorna o pedido existente se a `idempotency_key` já foi usada (evita pedidos duplicados em retry/duplo clique).
- Valida a forma de pagamento (`pix`, `card`, `delivery`).
- Valida itens: array com 1–50 linhas, `product_id` numérico, `quantity` inteira e positiva.
- Agrupa linhas duplicadas do mesmo produto antes de validar.
- Rejeita produtos inexistentes ou inativos.
- Limites agregados: máx. **20 unidades por produto** e **50 unidades por pedido**.
- **Recalcula o total no servidor** a partir de `products.price` — o preço enviado pelo cliente é ignorado.

### `public.submit_review(p_order_id uuid, p_rating int, p_comment text) returns uuid`

- Nota obrigatória entre 1 e 5; comentário opcional de até 1000 caracteres.
- Exige que o pedido exista.
- Uma avaliação por pedido (`reviews.order_id` é `UNIQUE`); uma segunda tentativa gera erro `review already submitted`.

## Uso na aplicação

| Arquivo                     | Operação                                         |
| --------------------------- | ------------------------------------------------ |
| `lib/neobite/products.ts`   | `select` em `products` (Server Component)        |
| `lib/neobite/actions.ts`    | Server Actions `createOrder` e `submitReview` (RPC) |
| `lib/supabase/server.ts`    | Cliente Supabase server-side (`@supabase/ssr`)   |

## Observações para produção

- O pagamento continua simulado: o pedido é gravado como `confirmed` sem cobrança real. Para cobrar de verdade, integre um gateway (ex.: Stripe) antes de criar o pedido.
- O cupom de 10% exibido após a avaliação ainda é apenas visual; não há tabela de cupons.
- Pedidos e avaliações são anônimos (sem autenticação). Para histórico por cliente, adicione Supabase Auth e uma coluna `user_id` com políticas RLS por usuário.

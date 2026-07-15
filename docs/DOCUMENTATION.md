# Documentação Técnica - GabizReview

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript 5
- **Estilo:** Tailwind CSS 4
- **Banco de dados:** Firebase Firestore (região: southamerica-east1 - São Paulo)
- **Autenticação:** Firebase Auth (Google Sign-In)
- **Ícones:** Lucide React
- **Deploy:** Vercel

## Estrutura de pastas

```
src/
  app/
    page.tsx                      # Landing page
    layout.tsx                    # Root layout (fonts, metadata, Providers)
    providers.tsx                 # AuthProvider wrapper
    reviews/
      page.tsx                    # Reviews page (com Suspense)
      review-list.tsx             # Lista filtrada/ordenada com URL params
      [id]/
        page.tsx                  # Detalhe da review (Server Component)
        review-detail.tsx         # Componente client para detalhe
    admin/
      page.tsx                    # Painel admin (CRUD)
      login/
        page.tsx                  # Login com Google
  components/
    navbar.tsx                    # Navbar sticky
    auth-guard.tsx                # Proteção de rotas admin
    review-card.tsx               # Card de review (público)
    review-form.tsx               # Formulário de criação/edição
    rating-stars.tsx              # Exibição de estrelas com suporte a meio estrela
    admin-review-list.tsx         # Lista de reviews do admin
  config/
    firebase.ts                   # Inicialização do Firebase
  lib/
    firebase-provider.tsx         # Contexto de autenticação
  services/
    reviews.ts                    # CRUD da coleção reviews
    books.ts                      # Consultas de títulos de livros
  types/
    review.ts                     # Tipos TypeScript
```

## Firebase

### Inicialização

O Firebase é inicializado em `src/config/firebase.ts` usando variáveis de ambiente.

### Firestore - Coleção `reviews`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | Não | Subtítulo da review |
| `bookTitle` | string | Sim | Título do livro |
| `author` | string | Sim | Autor do livro |
| `content` | string | Não | Conteúdo da review |
| `rating` | number | Sim | Nota 1-5 (suporta meio: 1.5, 2.5, etc.) |
| `coverUrl` | string | Não | URL da imagem da capa |
| `isFavorite` | boolean | Sim | Status "Queridinho" (padrão: false) |
| `createdAt` | Timestamp | Automático | Data de criação |
| `updatedAt` | Timestamp | Automático | Data da última atualização |
| `likesCount` | number | Automático | Contagem de likes (padrão: 0) |
| `commentsCount` | number | Automático | Contagem de comentários (padrão: 0) |

### Autenticação

- Login com popup Google
- Apenas o email na variável `NEXT_PUBLIC_ADMIN_EMAIL` tem acesso admin

## Variáveis de ambiente

Copie `.env.local.example` para `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAIL=seu-email@gmail.com
```

## Funcionalidades

### Públicas

- **Landing page** com hero e CTA para /reviews
- **Lista de reviews** com busca, filtro por nota (>=), filtro por favoritos, opções de ordenação, persistência via URL params
- **Detalhe da review** com capa, estrelas, indicador de favorito, conteúdo, link de volta

### Admin (protegido)

- **Login Google** (apenas email autorizado)
- **Criar review** com: título do livro (obrigatório), autor (obrigatório), título da review (opcional), conteúdo (opcional), URL da capa com preview (opcional), nota com suporte a meio estrela, checkbox de favorito
- **Editar review** (preenche o formulário)
- **Excluir review** (com confirmação)

## Componentes

- **RatingStars:** Exibição de estrelas com suporte a meio estrela, tamanhos: sm/md/lg
- **ReviewCard:** Card clicável com capa, badge de favorito, estrelas, título, data
- **ReviewForm:** Formulário de criação/edição, toggle de meio estrela no mesmo clique da estrela
- **AuthGuard:** Protege rotas admin, estados: loading, unauthenticated (redirect), unauthorized (signout), authorized
- **Navbar:** Nav sticky com logo, link Reviews, ícone Instagram, Admin/Entrar/Sair

## Deploy

- Configurado para deploy automático via GitHub no Vercel
- **Importante:** Adicionar o domínio do Vercel em Firebase Authentication > Settings > Authorized domains

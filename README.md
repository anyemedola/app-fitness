# Desafios Fitness em Grupo

Monorepo Turborepo de um app social de desafios fitness em grupo: dashboard de progresso diário, desafios de água/foto/contagem/sequência/sim-ou-não, feed social com reações e comentários, ranking e perfil. Frontend em Expo (React Native), backend em Node + Prisma, autenticação e mídia via Firebase.

O design (telas, textos, paleta "Blossom Bloom", microinterações) vem do protótipo em `~/Downloads/Desafios Fitness em Grupo/` e foi portado 1:1 para os componentes em `packages/ui` e `packages/theme`.

## Estrutura

```
apps/
  mobile/    Expo (React Native) — Clean Architecture (domain/data/infra/presentation)
  backend/   Node + Express + Prisma — Clean Architecture
packages/
  ui/        Componentes RN compartilhados (Avatar, ChallengeCard, Button, PhotoUploader, ...)
  theme/     Tema dinâmico (light/dark/system) + tokens de design
  firebase/  Auth (Google/Apple), feed em tempo real (Firestore), upload de fotos (Storage)
  utils/     Helpers compartilhados (datas, formatação, validação)
  config/    ESLint, TypeScript e Prettier compartilhados
.github/workflows/  CI (lint/typecheck/test/build) + trigger de EAS Build
docker-compose.yml  Postgres local para o backend
```

Cada app segue Clean Architecture: `domain` (entidades, casos de uso, interfaces de repositório) → `data` (implementações concretas dos repositórios) → `infra` (clientes HTTP/Prisma/Firebase) → `presentation` (telas, hooks, stores).

## Requisitos

- Node 20.9+ e [pnpm](https://pnpm.io) 10.13+ (`corepack enable` já resolve a versão certa via `packageManager` no `package.json`)
- Docker (para o Postgres local) — ou um Postgres já rodando em outro lugar
- Conta no [Firebase](https://console.firebase.google.com) (Auth, Firestore, Storage)
- Conta no [Expo](https://expo.dev) para builds via EAS
- Para testar Sign in with Apple de verdade: conta paga de Apple Developer + dispositivo/simulador iOS

## Instalação

```bash
pnpm install
```

## Configuração do Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → ative os provedores **Google** e **Apple**.
3. **Firestore Database** → crie o banco (modo produção). O app só usa Firestore para o feed social (posts/reações/comentários) em `groups/{groupId}/posts/...` — não precisa modelar mais nada manualmente.
4. **Storage** → ative, será usado para as fotos de comprovação em `photos/{userId}/{challengeId}/...`.
5. **Project settings → General → Your apps** → crie um app Web e copie as chaves para `apps/mobile/.env` (veja abaixo).
6. **Project settings → Service accounts** → gere uma chave privada nova (JSON). Os três campos (`project_id`, `client_email`, `private_key`) vão para `apps/backend/.env`.
7. Para o Google Sign-In nativo: em **Authentication → Sign-in method → Google**, copie o **Web client ID** para `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

## Variáveis de ambiente

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Preencha com os dados do seu projeto Firebase (passo anterior) e, no backend, a `DATABASE_URL` (já vem pronta para o `docker-compose.yml` local).

## Banco de dados (backend)

```bash
docker compose up -d                                  # sobe o Postgres local
pnpm --filter @app-fitness/backend prisma:migrate      # aplica o schema (cria as tabelas)
pnpm --filter @app-fitness/backend prisma:generate      # gera o Prisma Client (se necessário)
```

## Rodando o backend

```bash
pnpm --filter @app-fitness/backend dev
```

Sobe em `http://localhost:4000`. Endpoints (todos exigem `Authorization: Bearer <Firebase ID token>`):

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/challenges/today` | Desafios do usuário + progresso do período atual |
| POST | `/challenges` | Cria um novo desafio no grupo |
| POST | `/challenges/:id/progress` | Incrementa progresso (água/contagem) |
| POST | `/challenges/:id/photo` | Registra check-in com foto |
| POST | `/challenges/:id/check` | Marca sim/não ou sequência do dia |
| GET | `/stats` | % concluído hoje, dias seguidos, etc. |

## Rodando o app mobile

```bash
pnpm --filter @app-fitness/mobile start
```

Abra no Expo Go (funcionalidades limitadas — Google/Apple Sign-In e algumas libs nativas exigem um **dev client**) ou rode `pnpm --filter @app-fitness/mobile ios|android` com um build de desenvolvimento (`eas build --profile development`).

## Testes

```bash
pnpm turbo run test        # todos os workspaces
pnpm turbo run lint        # ESLint em todos os workspaces
pnpm turbo run typecheck   # tsc --noEmit em todos os workspaces
```

Cobertura: casos de uso (com repositórios fake/in-memory), controllers do backend (Supertest), repositórios Prisma (mocks do client), serviços do Firebase (mocks do SDK), componentes e hooks do mobile (Testing Library).

## CI/CD

- `.github/workflows/ci.yml`: lint + typecheck + test em todo push/PR; build do backend; dispara EAS Build (perfil `preview`) a cada push em `main`.
- `.github/workflows/eas-build.yml`: workflow reutilizável de build via EAS, também acionável manualmente (`workflow_dispatch`) escolhendo perfil e plataforma.
- Secret necessário no repositório: `EXPO_TOKEN` (gerado em [expo.dev → Access tokens](https://expo.dev/settings/access-tokens)).
- Perfis do EAS (`apps/mobile/eas.json`): `development`, `preview`, `production`.

Para builds locais via EAS:

```bash
cd apps/mobile
eas login
eas build:configure          # associa o projeto ao seu account/projectId do Expo
eas build --profile preview --platform all
```

## Limitações conhecidas / próximos passos

- **Grupos e ranking** usam dados locais fixos (`apps/mobile/src/data/local/groupsSeed.ts`) — o backend especificado cobre apenas desafios/progresso/stats, sem endpoints de grupos/membros. Trocar por uma API real é o próximo passo natural.
- **Ranking por desafio** (tela de detalhe) usa uma pontuação determinística de placeholder para os demais membros, já que não há endpoint de ranking por desafio.
- **Sign in with Apple** só funciona de fato em iOS com conta de desenvolvedor paga — o código está pronto, mas não foi validado end-to-end nesta entrega.
- Sem projeto Firebase/EAS reais configurados, o app builda e os testes passam, mas os fluxos de auth/Storage/Firestore precisam das suas próprias credenciais para funcionar de ponta a ponta.

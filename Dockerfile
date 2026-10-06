# --- ETAPA 1: Construcción (Build) ---
FROM node:24-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
# Limpiamos herramientas de desarrollo dejando solo dependencias de producción
RUN pnpm prune --prod

# --- ETAPA 2: Producción (Runtime) ---
FROM node:24-alpine AS runner
WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=8081
ENV NODE_ENV=production

# Copiamos solo lo estrictamente necesario desde la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 8081

CMD ["node", "./dist/server/entry.mjs"]
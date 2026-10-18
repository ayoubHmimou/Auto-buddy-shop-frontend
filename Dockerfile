# =============================================================================
# frontend - Angular (Sakai layout) behind nginx.
# Build context = frontend/ at PROJECT ROOT (sibling of devis-platform/), set as
# `context: ../frontend` in devis-platform/docker-compose.yml -> services.frontend.
#
# Multi-stage: node:22 builds the app, nginx serves the static output.
# =============================================================================
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first (layer caching).
COPY package*.json ./
RUN npm ci

# Build the production bundle (angular.json defaultConfiguration = production).
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine
# SPA fallback (deep links like /pages/devis must resolve to index.html).
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html
EXPOSE 80

FROM composer:latest AS build

WORKDIR /app

# Copier tout le projet
COPY . .

# Installer les dépendances Laravel
RUN composer install

# Installer Node + npm pour React
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    npm install && npm run build

# Générer la clé Laravel
RUN php artisan key:generate

# Utiliser PHP 8.2 + serveur intégré
FROM php:8.2-cli

WORKDIR /app

COPY --from=build /app /app

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

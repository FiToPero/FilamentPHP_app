# FilamentPHP Application with Docker

This is a Laravel application with FilamentPHP admin panel, configured to run in a Docker environment with Vite for asset bundling.

## Services

The application uses Docker Compose to orchestrate the following services:

- **php**: PHP-FPM 8.3 with Laravel application
- **nginx**: Web server (port 8080)
- **vite**: Vite development server for hot module replacement (port 5173)
- **db**: PostgreSQL database (port 5432)
- **redis**: Redis cache server
- **mailpit**: Mail testing tool (port 8025)

## Quick Start

1. Clone the repository
2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

3. Install PHP dependencies (if not already installed):
   ```bash
   docker-compose exec php composer install
   ```

4. Copy the environment file and generate application key:
   ```bash
   cp Laravel_app/.env.example Laravel_app/.env
   docker-compose exec php php artisan key:generate
   ```

5. Run database migrations:
   ```bash
   docker-compose exec php php artisan migrate
   ```

6. Access the application:
   - **Application**: http://localhost:8080
   - **Mailpit**: http://localhost:8025

## Vite Development Server

The Vite development server is configured to run in a separate container with:

- **Hot Module Replacement (HMR)**: Automatic browser refresh on file changes
- **CORS enabled**: Allows asset loading from different origins
- **File watching with polling**: Works reliably in Docker environments

### How it works

1. Vite runs on port 5173 in its own container
2. Nginx proxies requests for Vite-managed assets (resources, @vite, @id, @fs paths) to the Vite container
3. CORS headers are properly configured to avoid mixed content and MIME type errors

## Configuration Files

### vite.config.js
- Configured with `host: '0.0.0.0'` to accept connections from all interfaces
- `strictPort: true` ensures Vite uses port 5173
- `cors: { origin: '*' }` allows cross-origin requests
- `watch.usePolling: true` for reliable file watching in Docker

### docker/nginx/default.conf
- Proxies Vite asset requests to the Vite container
- Adds CORS headers to avoid browser errors
- Handles WebSocket upgrades for HMR

### docker-compose.yml
- Defines the Vite service
- Mounts the Laravel_app directory for live code updates
- Automatically runs `npm install && npm run dev`

## Troubleshooting

### CORS or MIME Type Errors

If you encounter errors like:
- "Blocked loading mixed active content"
- "The resource was blocked due to MIME type mismatch"
- "NS_ERROR_CORRUPTED_CONTENT"

These are typically resolved by:
1. Ensuring the Vite service is running: `docker-compose ps vite`
2. Checking Vite logs: `docker-compose logs vite`
3. Restarting the containers: `docker-compose restart nginx vite`

### Vite Not Updating

If changes aren't reflected:
1. Verify file polling is enabled in vite.config.js
2. Check Vite container logs for errors
3. Clear browser cache

## Development Workflow

1. Make changes to your files in `Laravel_app/resources/`
2. Vite will automatically detect changes and rebuild
3. Browser will refresh automatically via HMR
4. For PHP changes, refresh the browser manually

## Production Build

To build assets for production:

```bash
docker-compose exec vite npm run build
```

This will create optimized assets in `Laravel_app/public/build/`.

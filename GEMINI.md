# Project Overview

This is a full-stack, multi-tenant Portal Management System. The backend is built with Node.js, Fastify, and TypeScript, while the frontend is a Next.js application. The project uses PostgreSQL for the database, Redis for caching, and can be configured to use MinIO for S3-compatible object storage. Prisma is used as the ORM for database management. The entire application is designed to be containerized and deployed using Docker.

# Building and Running

The project includes a comprehensive project manager script (`project_manager.sh` and `project_manager.ps1`) that simplifies most development and deployment tasks.

## Key Commands

### Development

*   **Start development environment:**
    ```bash
    ./project_manager.sh # and select option 1
    ```
    or
    ```bash
    docker-compose up
    ```
*   **Run backend in development mode:**
    ```bash
    npm run dev
    ```
*   **Run frontend in development mode:**
    ```bash
    cd frontend && npm run dev
    ```

### Building

*   **Build the backend:**
    ```bash
    npm run build
    ```
*   **Build the frontend:**
    ```bash
    cd frontend && npm run build
    ```
*   **Build Docker images:**
    ```bash
    ./project_manager.sh # and select option 8
    ```
    or
    ```bash
    docker-compose build
    ```

### Testing

*   **Run backend tests:**
    ```bash
    npm test
    ```
*   **Run frontend tests:**
    ```bash
    cd frontend && npm test
    ```

# Development Conventions

*   **Code Style:** The project uses Prettier for code formatting.
*   **Type Checking:** TypeScript is used for static type checking. Run `npm run typecheck` to check for type errors.
*   **Database Migrations:** Database migrations are managed with Prisma. Use `npx prisma migrate dev` to create new migrations and `npx prisma migrate deploy` to apply them.
*   **Environment Variables:** The project uses `.env` files for managing environment variables. An example can be found in `.env.example`.
*   **Containerization:** The application is designed to be run in Docker containers. The `docker-compose.yml` file defines the services and their configurations.
*   **Deployment:** The `project_manager.sh` script provides several options for deploying the application to a VPS, including Docker Compose, Docker Hub images, and a Git pull and rebuild strategy.

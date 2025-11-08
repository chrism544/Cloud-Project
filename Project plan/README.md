# Portal Management System

This project provides a complete backend solution for a multi-tenant portal system, including a flexible theme engine, page management, and navigation menu construction.

## Architecture Overview

The system is designed as a headless CMS API, intended to be consumed by any frontend framework.

*   **Database:** A PostgreSQL database is used for data persistence. The schema is designed to be relational and scalable.
*   **API:** A RESTful API provides endpoints for managing all resources. The API specification is defined in `openapi.yaml`.
*   **Theming Engine:** A powerful inheritance-based theme engine allows for creating master themes and overriding them on a per-portal basis. This is handled by the `asset_containers` table.
*   **Authentication:** The API is secured using JWT Bearer Tokens. (RBAC is planned for future implementation).

## Getting Started

### Prerequisites

*   A running PostgreSQL instance.
*   A programming language and framework for the API server (e.g., Node.js/Express, Python/FastAPI).
*   A database migration tool (e.g., Flyway, Alembic).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory. You will need to provide database connection details and a secret for signing JWTs.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/portals_db"
    JWT_SECRET="your-super-secret-key"
    ```

3.  **Run Database Migrations:**
    Use your chosen migration tool to apply the schemas to the database. The initial schemas can be found in `Plan v1.md` and should be converted into migration files.

    ```bash
    # Example with a migration tool
    npm run db:migrate
    ```

4.  **Install Dependencies & Run Server:**
    Install the required language-specific dependencies and start the API server.

    ```bash
    # Example for a Node.js project
    npm install
    npm run start
    ```

## CI/CD

This project uses GitHub Actions for Continuous Integration and Continuous Deployment. The workflow is defined in `.github/workflows/ci.yml` and includes the following stages:

1.  **Lint:** Code is checked for style and formatting errors.
2.  **Test:** Unit and integration tests are run.
3.  **Build:** The application is built into a deployable artifact (e.g., a Docker image).
4.  **Deploy:** The built artifact is deployed to a staging/production environment. (This step is a placeholder and requires secrets to be configured).

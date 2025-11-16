# Theme Builder for Cloud Project

## Overview
The Theme Builder is a component of the Cloud Project portal system that allows users to create, edit, and manage themes for their portals. This project integrates seamlessly with the existing backend and frontend architecture, leveraging Fastify for the API and Next.js for the user interface.

## Features
- Create and manage themes with customizable properties.
- Live preview of themes as they are being edited.
- User-friendly interface for theme creation and editing.
- Integration with existing authentication and authorization mechanisms.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **src/**: Contains the main application code.
  - **server.ts**: Entry point for the Fastify server.
  - **plugins/**: Contains Fastify plugins, including authentication.
  - **modules/theme/**: Contains routes, services, and types related to theme management.
  - **utils/**: Contains utility functions and error handling.
- **prisma/**: Contains database migration files and the Prisma schema.
- **package.json**: Lists backend dependencies and scripts.
- **tsconfig.json**: TypeScript configuration for the backend.

### Frontend
- **app/**: Contains the Next.js application code.
  - **(portal)/dashboard/theme-builder/**: Contains pages for the theme builder dashboard, including listing, creating, and editing themes.
- **components/theme/**: Contains React components for theme management, including editors and previews.
- **lib/**: Contains hooks and API functions for interacting with the backend.
- **package.json**: Lists frontend dependencies and scripts.
- **tsconfig.json**: TypeScript configuration for the frontend.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL database
- Redis (for caching)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd theme-builder
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

5. Run database migrations:
   ```
   cd backend
   npx prisma migrate dev
   ```

### Running the Project
1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000/dashboard/theme-builder`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
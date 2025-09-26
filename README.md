# Task Manager

A web-based application for managing tasks with user authentication, task visibility controls, and categorization. 
The backend is built with Symfony (PHP) and PostgreSQL, while the frontend is developed using React. 
The application is containerized using Docker for consistent development and deployment.

Check the requirements [here](tech_requirements/objective.txt).

Screenhots are available in the [tech_requirements](tech_requirements/) directory.

## Setup Instructions

### Prerequisites
- **Docker**: Ensure Docker and Docker Compose are installed.
- **Make**: Optional, for using the provided Makefile.
- **Git**: To clone the repository.

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/SergioVasko/task-manager
   cd task-manager
   ```

2. **Run the Application**
   - Using the Makefile (recommended):
     ```bash
     make install
     ```
     This command:
     - Stops and removes old containers/volumes.
     - Fixes file permissions.
     - Cleans previous vendor and node_modules directories.
     - Builds Docker containers.
     - Installs PHP (Composer) and frontend (Yarn) dependencies.
     - Creates the database, runs migrations, and loads fixtures.

   - Manual setup:
     ```bash
     # Build and start containers
     docker-compose up -d --build

     # Install PHP dependencies
     docker-compose run --rm task-manager-php composer install

     # Create database and run migrations
     docker-compose exec task-manager-php bin/console doctrine:database:create --if-not-exists
     docker-compose run --rm task-manager-php php bin/console doctrine:migrations:migrate --no-interaction

     # Load fixtures
     docker-compose run --rm task-manager-php php bin/console doctrine:fixtures:load --no-interaction

     # Install frontend dependencies
     docker-compose run --rm task-manager-react yarn install
     ```

3. **Access the Application**
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8080`
   - **PostgreSQL**: Port `5432` (via `task-manager-db` service).

4. **Default Credentials**
   - Email: `user@example.com`
   - Password: `password`

5. **Stop the Application**
   ```bash
   make stop
   ```
   Or:
   ```bash
   docker-compose down
   ```

### Development Notes
- **Backend**: Access the PHP container with `docker-compose exec task-manager-php bash` for Symfony commands.
- **Frontend**: React auto-reloads on code changes.
- **Database**: PostgreSQL data persists in the `pgdata` volume.

## Design Decisions

### Backend (Symfony)
- **Framework**: Symfony for its robust ecosystem, security, and RESTful API support.
- **Authentication**: 
  - JSON login with Symfony Security Bundle, using session cookies for simplicity.
  - Password hashing optimized for tests with reduced cost.
- **Database**:
  - Entities: `User`, `Task`, `Category` with `User` 1:N `Task` and `Category` 1:N `Task` relationships.
  - `TaskVisibility` enum for type-safe visibility controls.
  - Doctrine migrations for schema consistency.
- **API**:
  - RESTful endpoints under `/api`.
  - DTOs (`TaskInput`, `TaskOutput`, `UserOutput`) for clean API contracts.
  - Symfony Validator for input validation.
- **Fixtures**: Seed data for development/testing.

### Frontend (React)
- **Framework**: React for component-based UI and ecosystem (React Router, Axios).
- **State Management**: `useState` and `useEffect` for simplicity.
- **Styling**: Tailwind CSS for utility-first styling.
- **API Integration**: Axios with session cookies for authentication.
- **Routing**: React Router for client-side navigation (`/`, `/login`).

### Infrastructure
- **Containerization**: Docker Compose for PHP, Nginx, PostgreSQL, and React.
- **Nginx**: Reverse proxy for PHP-FPM.
- **PostgreSQL**: Reliable database with Doctrine ORM.
- **Makefile**: Simplifies setup and management.

## Trade-offs and Incomplete Features

### Trade-offs
- **Authentication**: Session-based over JWT for simplicity, sacrificing stateless scalability.
- **Frontend**: Lightweight state management avoids Redux for simplicity but may limit scalability.
- **Category Management**: No UI for creating/editing categories, requiring known category IDs.
- **Error Handling**: Basic alerts; toast notifications or error boundaries would improve UX.
- **Testing**: Minimal tests (`App.test.js`); comprehensive testing deferred for functional focus.

### Incomplete Features
- **Category CRUD**: No frontend UI for category management.
- **Task Status**: Status selection not in frontend form.
- **Pagination/Sorting**: Task list lacks pagination/filtering.
- **Role-based Access**: Supports roles but lacks admin functionality.
- **Frontend Validation**: Relies on server-side validation; client-side validation needed.
- **Security Headers**: Nginx lacks CSP, HSTS for production.
- **Logging/Monitoring**: Minimal logging; production needs enhanced monitoring.

## Notes
- Focuses on core task management with authentication and visibility controls.
- Uses Symfony, React, PostgreSQL, and Docker.
- **Alternative API Approaches**:
  - **Symfony Forms**: Could replace manual DTO validation with Symfony Forms for streamlined input handling and validation, reducing boilerplate code.
  - **API Platform**: Offers out-of-the-box REST API functionality, automatic CRUD operations, and Swagger documentation generation, improving developer experience and API discoverability.
- **Serialization**: Instead of custom DTOs (`TaskInput`, `TaskOutput`), the Symfony Serializer Bundle could handle data transformation, reducing code duplication and leveraging built-in normalization/denormalization.
- **Service Layer**: Task creation/update logic in `TaskController` should be moved to a dedicated service (e.g., `TaskService`) for better separation of concerns, testability, and maintainability.
- **Workflow Management**: The Symfony Workflow Bundle could be added to manage task status transitions (e.g., `new` → `in_progress` → `completed`), ensuring controlled and validated state changes.
- **Testing**: Code coverage is minimal. Comprehensive unit, integration, and end-to-end tests (e.g., using PHPUnit for backend, Jest/Testing Library for frontend) are needed for production reliability.
- Future improvements: enhanced UX, category management, testing, and CI/CD.
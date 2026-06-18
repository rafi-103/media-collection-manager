# System Design

**Architecture:** Client-Server (Three-Tier)

1. **Presentation Layer (Frontend - React)**
   - Handles user interface and interaction.
   - Communicates with the backend via REST API calls using Axios.
   - Includes components for Dashboard, Add/Edit Forms, Search, and Detail Views.

2. **Application Layer (Backend - FastAPI)**
   - Handles business logic and routing.
   - Uses a layered architecture:
     - **Routers:** Define API endpoints (`/api/items`).
     - **Services:** Contain business logic.
     - **Repositories:** Handle database operations.
     - **Schemas:** Define Pydantic models for data validation.
   - Manages CORS configuration to allow frontend requests.

3. **Data Layer (Database - PostgreSQL)**
   - Stores persistent data in `items` and `loans` tables.
   - Accessed via SQLAlchemy ORM.

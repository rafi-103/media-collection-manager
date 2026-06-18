# Data Flow Diagram (DFD)

**Description:**
The application follows a three-tier architecture:

1. **User Interface (React):** The frontend displays data to the user and captures user inputs (clicks, forms). It sends HTTP requests to the backend.

2. **Backend (FastAPI):** The backend receives requests, validates data, processes business logic, and communicates with the database.

3. **Database (PostgreSQL):** The database stores all media items, user data, and lending records.

**Data Flow (Add Item):**
1. User enters item details in the React form.
2. React sends a POST request with the item data to the FastAPI `/api/items` endpoint.
3. FastAPI validates the data and uses the Repository layer to insert the new record into the PostgreSQL database.
4. PostgreSQL confirms the insertion.
5. FastAPI returns a success response to React.
6. React updates the UI to show the new item.

**Data Flow (View Items):**
1. User navigates to the dashboard.
2. React sends a GET request to FastAPI `/api/items`.
3. FastAPI queries the PostgreSQL database.
4. PostgreSQL returns the list of items.
5. FastAPI sends the JSON data back to React.
6. React renders the items as cards on the screen.

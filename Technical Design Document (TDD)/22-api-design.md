# API Design

**Base URL:** `https://api.yourapp.com/api`

**Authentication:** Not required for MVP (can be added later).

**Endpoints:**

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| GET | `/items` | Get all items | None |
| POST | `/items` | Create a new item | `{ "title", "type", "creator", "genre", "status", "rating", "platform?", "is_favorite?" }` |
| GET | `/items/{id}` | Get a single item by ID | None |
| PUT | `/items/{id}` | Update an existing item | `{ "title", "type", "creator", "genre", "status", "rating", "platform?", "is_favorite?" }` |
| DELETE | `/items/{id}` | Delete an item | None |
| GET | `/items?type=book` | Filter items by type | Query Parameter: `type` |
| GET | `/items?search=harry` | Search items by keyword | Query Parameter: `search` |
| POST | `/items/{id}/lend` | Lend a book to a friend | `{ "friend_name", "return_date" }` |

**Example Response (GET /items):**
```json
[
  {
    "id": 1,
    "title": "Harry Potter",
    "type": "book",
    "creator": "J.K. Rowling",
    "genre": "Fantasy",
    "status": "currently_reading",
    "rating": 5,
    "platform": null,
    "is_favorite": false,
    "notes": "Loving it so far!"
  },
  {
    "id": 2,
    "title": "Inception",
    "type": "movie",
    "creator": "Christopher Nolan",
    "genre": "Sci-Fi",
    "status": "watched",
    "rating": 5,
    "platform": "Netflix",
    "is_favorite": true,
    "notes": "Mind-blowing!"
  }
]

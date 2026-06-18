# Database Design

**Database System:** PostgreSQL

**Schema Name:** `media_collection`

**Table 1: items**

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Title of the book or movie |
| type | VARCHAR(50) | NOT NULL | 'book' or 'movie' |
| creator | VARCHAR(255) | NOT NULL | Author (book) or Director (movie) |
| genre | VARCHAR(100) | - | Genre (e.g., Fiction, Sci-Fi) |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'want_to_read' | Status based on type |
| rating | INTEGER | CHECK (1-5) | User rating out of 5 |
| platform | VARCHAR(100) | - | For movies (Netflix, Blu-ray, etc.) |
| is_favorite | BOOLEAN | DEFAULT FALSE | For movies (⭐ Favorite) |
| notes | TEXT | - | Personal notes/review |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Table 2: loans**

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| item_id | INTEGER | FOREIGN KEY (items.id) | Reference to the book |
| friend_name | VARCHAR(255) | NOT NULL | Name of the borrower |
| return_date | DATE | NOT NULL | Expected return date |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Loan creation timestamp |

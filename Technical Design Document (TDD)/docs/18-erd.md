# Entity Relationship Diagram (ERD)

**Tables:**

1. **items**
   - `id` (Primary Key, Integer)
   - `title` (String, Required)
   - `type` (String, "book" or "movie")
   - `creator` (String, Author for Book, Director for Movie)
   - `genre` (String)
   - `status` (String, e.g., "reading", "watchlist", "completed", "loaned")
   - `rating` (Integer, 1-5)
   - `platform` (String, for Movies, e.g., "Netflix", "Blu-ray")
   - `is_favorite` (Boolean, for Movies)
   - `notes` (Text, optional)

2. **loans** (For Books only)
   - `id` (Primary Key, Integer)
   - `item_id` (Foreign Key, references `items.id`)
   - `friend_name` (String, Required)
   - `return_date` (Date, Required)
   - `created_at` (Timestamp)

**Relationships:**
- One-to-Many: `items.id` → `loans.item_id`

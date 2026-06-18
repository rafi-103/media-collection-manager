# Use Cases

**UC-01: Add a Book**
- **Actor:** User
- **Description:** User adds a new book to their collection.
- **Pre-condition:** User is logged in and on the dashboard.
- **Post-condition:** The new book is saved in the database and visible in the dashboard.
- **Basic Flow:**
  1. User clicks "Add Item".
  2. User selects Type: "Book".
  3. User enters Title, Author, Genre, Status, Rating.
  4. User clicks "Save".
  5. System saves the data and refreshes the list.

**UC-02: Add a Movie**
- **Actor:** User
- **Description:** User adds a new movie to their collection.
- **Pre-condition:** User is logged in and on the dashboard.
- **Post-condition:** The new movie is saved in the database and visible in the dashboard.
- **Basic Flow:**
  1. User clicks "Add Item".
  2. User selects Type: "Movie".
  3. User enters Title, Director, Genre, Status, Rating, Platform.
  4. User clicks "Save".
  5. System saves the data and refreshes the list.

**UC-03: Search for an Item**
- **Actor:** User
- **Description:** User searches for an item using a keyword.
- **Pre-condition:** User is on the dashboard.
- **Post-condition:** Only matching items are displayed.
- **Basic Flow:**
  1. User types a keyword in the search bar.
  2. User clicks "Search".
  3. System filters the list and displays matching results.

**UC-04: Lend a Book**
- **Actor:** User
- **Description:** User marks a book as lent to a friend.
- **Pre-condition:** The item exists and is a Book.
- **Post-condition:** The book status updates to "Loaned" with friend's name and return date.
- **Basic Flow:**
  1. User views a book detail.
  2. User clicks "Lend".
  3. User enters friend's name and return date.
  4. User clicks "Confirm".
  5. System updates the status.

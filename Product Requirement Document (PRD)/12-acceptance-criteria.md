# Acceptance Criteria

**Add Item:**
- Given I am on the dashboard, when I click "Add Item", then I see a form with fields: Title, Type (Book/Movie), Creator, Genre, Status, Rating.
- Given I fill all required fields, when I click "Save", then the item appears in my collection list.

**Search:**
- Given I am on the dashboard, when I type a keyword in the search bar and click "Search", then only items containing that keyword in Title or Creator are displayed.

**Filter:**
- Given I am on the dashboard, when I select "Book" from the Type filter, then only Books are displayed.

**Lend (Book Only):**
- Given I view a book detail, when I click "Lend" and enter a friend's name and return date, then the book status changes to "Loaned to [Friend]".

**Mark Favorite (Movie Only):**
- Given I view a movie detail, when I click the "⭐ Favorite" toggle, then the movie is saved as a favorite and a star icon appears on its card.

# Software Requirements Specification (SRS)

## 1. Introduction
The Personal Media Collection Manager is a web-based system for managing personal collections of books and movies. It allows users to perform CRUD operations, search, filter, and track lending status.

## 2. Purpose
The purpose of this document is to specify the functional and non-functional requirements for the application to guide development and testing.

## 3. Functional Requirements (Summary)
- **FR-01:** Add Media Item (Book/Movie)
- **FR-02:** View All Items
- **FR-03:** Edit Media Item
- **FR-04:** Delete Media Item
- **FR-05:** Search Items
- **FR-06:** Filter Items (by Type/Status)
- **FR-07:** Dashboard Statistics
- **FR-08:** Lend Book (with friend name and return date)
- **FR-09:** Movie Favorites and Platform Logging

## 4. Non-Functional Requirements (Summary)
- **NFR-01:** Fast loading times (<2 seconds).
- **NFR-02:** Responsive and intuitive UI.
- **NFR-03:** Secure handling of credentials.
- **NFR-04:** Graceful error handling.
- **NFR-05:** Maintainable layered architecture.

## 5. Technology Stack
- **Frontend:** React.js, CSS3, Axios
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (via SQLAlchemy)
- **Deployment:** Vercel (Frontend), Render/AWS (Backend), Supabase/RDS (Database)

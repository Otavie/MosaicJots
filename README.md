# MOSAIC JOTS API - BLOGGING API

## Description

This project involves building a Blogging API called **Mosaic Jots API** that enables users to create, manage, and retrieve articles. It supports user authentication, blog creation, modification, and retrieval, including functionality like pagination, searching, and sorting.

## Entity Relationship Diagram (ERD)

To view the ERD for this database design, please visit the [ERD Diagram](https://drawsql.app/teams/otavie/diagrams/blog-api-design) for a visual representation of the entity relationships.

## Requirements

1. **User Management**

   - Users have attributes: first name, last name, email, password, and potentially other customizable attributes.
   - Registration and login features for users are implemented.
   - JWT is utilized for user authentication with token expiration after 1 hour.

2. **Blog States**

   - Blogs can be in "draft" or "published" states.
   - Both logged-in and non-logged-in users can access a list of published blogs and read them.

3. **Blog Creation & Management**

   - Logged-in users can create blogs, which start in a "draft" state.
   - The blog owner can update a blog to the "published" state, edit blogs in both "draft" and "published" states, and delete them as needed.

4. **Blog Access & Interaction**

   - The blog owner can retrieve a list of their blogs. The endpoint is paginated and filterable by state.
   - Blog entries consist of: title, description, tags, author details, timestamp, state, read count, reading time, and body.

5. **List of Blogs Endpoint**

   - This endpoint is accessible to both logged-in and non-logged-in users and is paginated.
   - Default page size is set to 20 blogs per page and allows searching by author, title, and tags. It also supports ordering by read count, reading time, and timestamp.

6. **Blog Details**

   - Retrieving a single blog updates its read count and returns author information.
   - Reading time of the blog is calculated using a designated algorithm.

7. **Testing, Logging, and Visualization**
   - Comprehensive tests are written for all endpoints.
   - Winston is used for logging functions and processes.
   - (Optional) Additional points for building views (UI/UX) for better user interaction.

## Database

- MongoDB is the chosen database for this project.

## Data Models

### User

- Email (required and unique)
- First name and Last name (required)
- Password

### Blog/Article

- Title (required and unique)
- Description
- Author
- State
- Read count
- Reading time
- Tags
- Body (required)
- Timestamp

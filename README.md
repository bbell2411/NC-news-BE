# 📰 NC News Backend API

🔗[Live hosted link](https://nc-newz-u95l.onrender.com/api)

A RESTful backend service built for a news application, allowing users to interact with articles, comments, topics, and users.
Includes full CRUD functionality, filtering, sorting, and pagination.

# 📚 Tech Stack

- Node.js

- Express

- PostgreSQL

- Jest for testing

- MVC architecture

# ✅ Features

- Fetch all articles or filter them by topic.

- Sort articles by date, votes, title, or author in ascending/descending order.

- View individual article details including comment count.

- Post comments on articles.

- Upvote/downvote articles.

- Delete comments.

# 🛠 Requirements

- Node.js (v18+ recommended)

- PostgreSQL

# 🚀 Getting Started

## 1. Clone the Repository
```
git clone <repo-url>
cd nc-news
```
## 2. Install Dependencies
```
npm install
```
## 3. Set Up Environment Variables
Create two .env files in the root of your project:

### .env.development
PGDATABASE=nc_news

### .env.test
PGDATABASE=nc_news_test

## 4. Create and Seed the Databases
```
npm run setup-dbs
npm run test-seed
npm run seed-dev
```
## 5. Run Tests
```
npm test
```

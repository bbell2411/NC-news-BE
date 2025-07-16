# NC News Seeding

- link to hosted server: https://nc-newz-u95l.onrender.com/api

- NC-news API is a RESTful backend service for a news application, allowing users
  to interact with articles, comments and topics.
  It provides endpoints for fetching, posting, updating and deleting articles and comments, along side features such as, filtering and sorting options.

- Built with Node.js, Express, and PostgresSQL.

- This project follows MVC architecture and includes fully tested
  endpoints using jest.

# Requirements to run the project

- Ensure you have the minimum versions of NODE.js and Postgres.

# Features

- Fetch all articles or filter by topic.

- Sort articles by date, votes, title or author in ascending or descending order.

- View an article's details, aswell as it's comment count.

- Post comments under an article.

- Upvote/downvote articles.

- Delete comments.

# Clone repository

- Copy the repository URL and paste in the terminal: git clone <repo-url>

# Install dependencies

- install dependencies included in the package.json file.

- Terminal command: npm install 

# Instructions for .env setup

- Create 2 .env files in the root directory.

- First file name ".env.development" with the ENVIRONMENTAL variable
  PGDATABASE set to nc_news.

- Second file name ".env.test" with the ENVIRONMENTAL variable
  PGDATABASE set to nc_news_test.

# Seed local database

- Package.json includes scripts to run in order to seed both the
  developement and test database with the following commands.

- Setting up the databases: npm run setup-dbs

- To connect to development database: npm run seed-dev

- To connect to test database: npm run test-seed

- To run tests on the test database: npm test

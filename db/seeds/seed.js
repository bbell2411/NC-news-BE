const db = require("../connection")
const format = require('pg-format')
const { convertTimestampToDate, authorTitle, formatComments } = require('../seeds/utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`)
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(1000) NOT NULL,
      img_url VARCHAR(1000)
      )`)
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(1000))`)
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      )`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) NOT NULL,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(100) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)
    })
    .then(() => {
      const nestedArray = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url]
      })
      const sql = format(`INSERT INTO topics
    (slug, description, img_url)
    VALUES %L RETURNING *`, nestedArray)
      return db.query(sql)


    })
    .then(() => {
      const nestedArray = userData.map((user) => {
        return [user.username, user.name, user.avatar_url]
      })
      const sql = format(`INSERT INTO users 
        (username,name,avatar_url)
        VALUES %L`, nestedArray)
      return db.query(sql)

    })
    .then(() => {
      const nestedArray = articleData.map((article) => {
        const data = convertTimestampToDate(article)
        return [data.title,
        article.topic,
        article.author,
        article.body,
        data.created_at,
        article.votes,
        article.article_img_url]
      })
      const sql = format(`INSERT INTO articles
      (title,topic,author,body,created_at,votes,article_img_url)
      VALUES
      %L RETURNING *`, nestedArray)
      return db.query(sql)
    })
    .then((insertedArticles) => {
      const formattedComments = formatComments(commentData, insertedArticles.rows).map
        ((comment) => {
         const data= convertTimestampToDate(comment)
          return [
            comment.article_id,
            comment.body,
            comment.votes,
            comment.author,
            data.created_at
          ]
        })

      const sql = format(`insert into comments
        (article_id,body,votes,author,created_at)
        values
        %L returning *`, formattedComments)
      return db.query(sql) 
    })
   }


module.exports = seed;


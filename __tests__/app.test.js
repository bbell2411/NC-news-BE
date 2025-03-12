const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const app = require('../app')
const db = require('../db/connection')
const { toBeSortedBy } = require('jest-sorted')


beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe('GET /api/topics', () => {
  test('200: gets topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3)

        body.topics.forEach((topic) => {
          const { description, slug, img_url } = topic
          expect(typeof description).toBe('string')
          expect(typeof slug).toBe('string')
          expect(typeof img_url).toBe('string')
        })
      })

  })
})

describe('GET /api/articles', () => {
  test('200: gets articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5)

        articles.forEach((article) => {
          const { article_id, title, topic, author, created_at, votes, article_img_url, comment_count } = article
          expect(typeof article_id).toBe('number')
          expect(typeof author).toBe('string')
          expect(typeof title).toBe('string')
          expect(typeof topic).toBe('string')
          expect(typeof created_at).toBe('string')
          expect(typeof votes).toBe('number')
          expect(typeof article_img_url).toBe('string')
          expect(typeof comment_count).toBe('string')

        })
      })

  })
  test('200: sorts articles by date in descending order', () => {
    return request(app)
      .get('/api/articles?sort_by=created_at')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })

  })
  test('404: responds with error message if query is invalid ', () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .then(({ body }) => {
        expect(404)
        expect(body.msg).toBe('invalid sort')
      })

  })
})

describe('GET /api/users ', () => {
  test('200: gets users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          const { username, name, avatar_url } = user
          expect(typeof username).toBe('string')
          expect(typeof name).toBe('string')
          expect(typeof avatar_url).toBe('string')
        })
      })
  })
 
})

  

  describe('GET /api/articles/:article_id', () => {
    test('200: responds with articles by specific id', () => {
      return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body: article }) => {
          const { article_id, author, title, body, topic, created_at, votes, article_img_url } = article.article
          expect(article_id).toBe(3)
          expect(typeof author).toBe('string')
          expect(typeof title).toBe('string')
          expect(typeof body).toBe('string')
          expect(typeof topic).toBe('string')
          expect(typeof created_at).toBe('string')
          expect(typeof votes).toBe('number')
          expect(typeof article_img_url).toBe('string')

        })
    })

    test('404: responds with error msg of not found if no such id', () => {
      return request(app)
        .get('/api/articles/87768')
        .then(({ body }) => {
          expect(404)
          expect(body.msg).toBe('no such article')
        })
    })

    test('400: responds with error msg of bad request if no such id', () => {
      return request(app)
        .get('/api/articles/holaa')
        .then(({ body }) => {
          expect(400)
          expect(body.msg).toBe('bad request')
        })
    })
  })

  describe('GET /api/articles/:article_id/comments', () => {
    test('200: gets comments from specified article_id', () => {
      return request(app)
        .get('/api/articles/9/comments')
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.length).toBe(2)

          comment.forEach((com) => {
            const { comment_id, votes, created_at, author, body, article_id } = com
            expect(typeof comment_id).toBe('number')
            expect(typeof votes).toBe('number')
            expect(typeof created_at).toBe('string')
            expect(typeof author).toBe('string')
            expect(typeof body).toBe('string')
            expect(article_id).toBe(9)
          })
        })

    })

    test('200: gets comments from specified article_id WITH SORT QUERY', () => {
      return request(app)
        .get('/api/articles/9/comments?sort_by=created_at')
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.length).toBe(2)

          comment.forEach((com) => {
            const { comment_id, votes, created_at, author, body, article_id } = com
            expect(typeof comment_id).toBe('number')
            expect(typeof votes).toBe('number')
            expect(typeof created_at).toBe('string')
            expect(typeof author).toBe('string')
            expect(typeof body).toBe('string')
            expect(article_id).toBe(9)
            expect([com]).toBeSortedBy('created_at', { descending: true })
          })
        })

    })

    test('200: responds a message if an existing article does not have any comments', () => {
      return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual([])
        })
    })

    test('400: responds with error message IF sort query is invalid', () => {
      return request(app)
        .get('/api/articles/8/comments?sort_by=body')
        .then(({ body }) => {
          expect(400)
          expect(body.msg).toBe('invalid request')
        })
    })

    test('404: responds with error message if article doesnt exists', () => {
      return request(app)
        .get('/api/articles/8779/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('no such article id')
        })
    })

    test('400: responds with error message if its a bad request', () => {
      return request(app)
        .get('/api/articles/holaaa/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
  })

  describe('POST /api/articles/:article_id/comments', () => {
    test('201: responds with given post request of a comment.', () => {
      return request(app)
        .post('/api/articles/6/comments')
        .send({
          username: 'icellusedkars',
          body: 'i love cats'
        })
        .expect(201)
        .then(({ body: { postedComment } }) => {
          const { article_id, author, body, votes, created_at } = postedComment
          expect(article_id).toBe(6)
          expect(typeof votes).toBe('number')
          expect(typeof created_at).toBe('string')
          expect(author).toBe('icellusedkars')
          expect(body).toBe('i love cats')
        })
    })

    test('404: responds with error message if username doesnt exist in the database.', () => {
      return request(app)
        .post('/api/articles/6/comments')
        .send({
          username: 'fakeUser',
          body: 'i love cats'
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('this username does not exist')
        })
    })

    test('400: responds with error message if article_id does not exist.', () => {
      return request(app)
        .post('/api/articles/989877/comments')
        .send({
          username: 'icellusedkars',
          body: 'i love cats'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('no such article')
        })
    })

    test('403: responds with error message if comment is banned', () => {
      return request(app)
        .post('/api/articles/6/comments')
        .send({
          username: 'icellusedkars',
          body: 'i hate cats'
        })
        .then(({ body }) => {
          expect(403)
          expect(body.msg).toBe('forbidden comment')
        })

    })
  })

  describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body: { updatedArticle } }) => {
          const { article_id, title, topic, author, body, created_at, votes, article_img_url } = updatedArticle
          expect(article_id).toBe(1)
          expect(typeof title).toBe('string')
          expect(typeof topic).toBe('string')
          expect(typeof author).toBe('string')
          expect(typeof body).toBe('string')
          expect(typeof created_at).toBe('string')
          expect(votes).toBe(110)
          expect(typeof article_img_url).toBe('string')
        })

    })

    test('404: responds with error message if article_id is not found', () => {
      return request(app)
        .patch('/api/articles/50')
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('no such article')
        })
    })

    test('400: responds with error message if article_id is not a number (bad request)', () => {
      return request(app)
        .patch('/api/articles/wtf')
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })

    test('400: responds with error if votes is already 0 & can no longer be decremented', () => {
      return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: -20 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('votes cannot be less than 0')
        })
    })

    test('400: responds with error if votes is not a number', () => {
      return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 'one million' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
  })

  describe('DELETE /api/comments/:comment_id', () => {
    test('204: responds with no content', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({})
        })
    })

    test('404: responds with error message if comment doesn\'t exist', () => {
      return request(app)
        .delete('/api/comments/9899')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('comment not found')
        })
    })

    test('400: responds with error message if bad request', () => {
      return request(app)
        .delete('/api/comments/deleteMyComment!!!')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
  })

describe('ANY OTHER PATH', () => {
  test('404: responds with err msg when path is not found', () => {
    return request(app)
      .get('/blahblah')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('path not found')
      })
  })
})
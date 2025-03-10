const endpointsJson = require("../endpoints.json");
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const app = require('../app')
const db = require('../db/connection')


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
        body.topics.forEach((topic) => {
          const { description, slug, img_url } = topic
          expect(typeof description).toBe('string')
          expect(typeof slug).toBe('string')
          expect(typeof img_url).toBe('string')
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
      .then(({body})=>{
        expect(404)
        expect(body.msg).toBe('not found')
      })
  })

  test('400: responds with error msg of bad request if no such id', () => {
    return request(app)
      .get('/api/articles/hola')
      .then(({body})=>{
        expect(400)
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
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


xdescribe("GET /api", () => {
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
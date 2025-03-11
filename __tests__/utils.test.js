const { commentData } = require("../db/data/test-data");
const {
  convertTimestampToDate, articlesLookup,formatComments
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});
//change article_title to be article_id=the actual id
describe('articlesLookup',()=>{
  test('returns empty object if array is empty.',()=>{
     const input= []
    const output=articlesLookup(input)
    expect(output).toEqual({})
  })
  test('returns an object with the article\'s title as a key and id as it\'s value ',()=>{
    const input=[{
      article_id: 1,
      title: 'Living in the shadow of a great man'
    }]

    const output=articlesLookup(input)
    expect(output).toEqual({'Living in the shadow of a great man':1})

  })
  test('returns an object with the article\'s title as a key and id as it\'s value from an array with multiple objects',()=>{
    const input=[{
      article_id: 1,
      title: 'dhdw'
    },
    {
      article_id: 2,
      title: 'hello3'
    },
    {
      article_id: 3,
      title: 'hellp4'
    }]

    const output=articlesLookup(input)
    expect(output).toEqual({dhdw:1,
      hello3:2,
      hellp4:3
    })

  })
})

describe('formatComments',()=>{
  test('returns empty object if input array is empty',()=>{
    const input=[{
      article_title: "They're not exactly dogs, are they?",
    },
    {
      article_title: "Living in the shadow of a great man",
    },
    {
      article_title: "Living in the shadow of a great man",
    }]
    const input2=[]
    const output= formatComments(input,input2)
    expect(output).toEqual([])
  })
  test('returns an array of the article_id for one title ',()=>{
    const input=[{
      article_title: "They're not exactly dogs, are they?",
    }]
    const input2=[{
      article_id: 1,
      title: 'They\'re not exactly dogs, are they?'
    }]
    const output= formatComments(input,input2)
    expect(output).toEqual([{
     article_id: 1,
     article_title:'They\'re not exactly dogs, are they?'
    }])
  })

  test('returns an array of the article_id for each title ',()=>{
    const input=[{
      article_title: "They're not exactly dogs, are they?",
    },
    {
      article_title: "Living in the shadow of a great man",
    },
    {
      article_title: "Living in the shadow of a great man",
    }]
    const input2=[{
      article_id: 1,
      title: 'They\'re not exactly dogs, are they?'
    },
    {
      article_id: 2,
      title: "Living in the shadow of a great man",
    },
    {
      article_id: 2,
      title: "Living in the shadow of a great man",
    }]
    const output= formatComments(input,input2)
    expect(output).toEqual([{
     article_id: 1,
     article_title:'They\'re not exactly dogs, are they?'
    },
    {
      article_id: 2,
      article_title:"Living in the shadow of a great man"
    },
    {
      article_id:2,
      article_title:"Living in the shadow of a great man"
    }])

    expect(output).not.toBe(input)
    expect(input).toBe(input)
  })
})

const db = require("../../db/connection");
const articles = require("../data/test-data/articles");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


exports.articlesLookup = (articleData) => {
  if (articleData.length === 0) {
    return {}
  }
  const res = {}
  for (let i = 0; i < articleData.length; i++) {
    res[articleData[i].title] = articleData[i].article_id
  }
  return res

}

exports.formatComments = (commentData, articleData) => {
  if (articleData.length === 0) {
    return []
  }
  const res = []
  const articlesFunc = this.articlesLookup(articleData)
  for (let i = 0; i < commentData.length; i++) {
    const comment = commentData[i]
    comment.article_id = articlesFunc[comment.article_title]
    delete comment.article_title
    res.push(comment)
  }
  return res
}


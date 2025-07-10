const db = require("../../db/connection");

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
  const commentsCopy = [...commentData]
  const ariclesCopy = [...articleData]
  const formattedComments = []
  const lookupObj = this.articlesLookup(ariclesCopy)

  for (let i = 0; i < commentsCopy.length; i++) {
    const comment = commentsCopy[i]
    comment.article_id = lookupObj[comment.article_title]
    formattedComments.push(comment)
  }
  return formattedComments
}

const format = require('pg-format')

exports.checkExists = (table, column, value) => {
  const sqlString = format(`select * from %I where %I = $1`, table, column)
  return db.query(sqlString, [value]).then(({ rows }) => {
    if (rows.length===0){
      return Promise.reject({status:404,msg:'not found'})
    }
    return true
  })
}

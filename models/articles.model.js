const db = require('../db/connection')

exports.fetchArticles = (sort_by = 'created_at') => {
    if (sort_by !== 'created_at') {
        return Promise.reject({ status: 404, msg: 'invalid sort' })
    }
    return db.query(`select articles.*, 
        COUNT(comments.article_id) AS comment_count
        From articles
        Join comments on articles.article_id = comments.article_id
        group by articles.article_id
        ORDER BY articles.${sort_by} DESC;`)
        .then(({ rows }) => {
            return rows
        })
}



exports.fetchArticlesById = (id) => {
    return db.query(`select * from articles where article_id=$1`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'no such article' })
            }
            return rows[0]
        })
}

exports.fetchComments = (id,sort_by='created_at') => {
    if (sort_by!=='created_at'){
        return Promise.reject({status:400,msg:'invalid request'})
    }
    return db.query(`select * from comments where article_id=$1
        ORDER BY ${sort_by} DESC`,[id])
        .then(({ rows }) => {
            if (rows.length===0){
                return Promise.reject({status:404,msg:'no such article id'})
            }
            return rows
        })
}
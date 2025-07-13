const db = require('../db/connection')
const { checkExists } = require('../db/seeds/utils')

exports.fetchArticles = async (sort_by = 'created_at', order = 'DESC', topics) => {
    let topicExists = false
    if (topics !== undefined) {
        const checkTopicExists = await db.query(`select * from topics where slug=$1`, [topics])
        if (checkTopicExists.rows.length > 0) {
            topicExists = true
        }
        const checkTopicsValidity = await db.query(`select * from articles where topic=$1`, [topics])
        if (checkTopicsValidity.rows.length === 0 && !topicExists) {
            return Promise.reject({ status: 404, msg: 'invalid query' })
        }

    }
    const validSorts = ['created_at', 'title', 'topic', 'author', 'votes']
    if (!validSorts.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'invalid sort' })
    }
    const validOrders = ['ASC', 'DESC', 'desc', 'asc']
    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, msg: 'invalid order' })
    }

    let finalQuery = `select articles.*, 
        COUNT(comments.article_id)::INT AS comment_count
        From articles
        Join comments on articles.article_id = comments.article_id `

    const queries = []

    if (topics) {
        queries.push(topics)
        finalQuery += `where articles.topic=$1 `
    }

    finalQuery += `group by articles.article_id
        ORDER BY articles.${sort_by} ${order};`

    return db.query(finalQuery, queries)
        .then(({ rows }) => {
            return rows
        })
}



exports.fetchArticlesById = async (id) => {
    return db.query(`select articles.*,
         COUNT(comments.article_id)::INT  AS comment_count from articles
         JOIN comments on comments.article_id=articles.article_id
         where articles.article_id=$1
         group by articles.article_id`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'no such article' })
            }
            return rows[0]
        })
}

exports.fetchComments = async (id, sort_by = 'created_at') => {
    if (sort_by !== 'created_at') {
        return Promise.reject({ status: 400, msg: 'invalid request' })
    }
    const articleExists = await db.query(`select * from articles where article_id=$1`, [id])

    if (articleExists.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'no such article id' })
    }

    return db.query(`select * from comments where article_id=$1
        ORDER BY ${sort_by} DESC`, [id])
        .then(({ rows }) => {
            return rows
        })
}

exports.acceptComment = (username, body, id) => {
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: 'must have the valid keys and/or valid values' })
    }

    return Promise.all([checkExists('users', 'username', username),
    checkExists('articles', 'article_id', id)
    ])
        .then(() => {
            return db.query(`insert into comments
            (article_id,author,body)
            values
            ($1,$2,$3) returning *`, [id, username, body])

        })
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.renewArticle = (id, inc_votes) => {
    if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'bad request' });
      }
    
    return db.query(`update articles 
        set votes = votes + $1
        where article_id=$2
        returning *`, [inc_votes, id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'no such article' })
            }
            return rows[0]
        })

}


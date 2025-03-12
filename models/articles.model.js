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



exports.fetchArticlesById = async (id) => {
    const idNum = Number(id)
    if (typeof idNum !== 'number') {
        return Promise.reject({ status: 400, msg: 'bad request' })
    }
    return db.query(`select * from articles where article_id=$1`, [id])
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

exports.acceptComment = async (username, body, id) => {

    const invalidText = 'i hate cats'

    if (body === invalidText) {
        return Promise.reject({ status: 403, msg: 'forbidden comment' })
    }

    const validUsername = await db.query(`select * from users where username=$1`, [username])
    if (validUsername.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'this username does not exist' })
    }

    const validArticleId = await db.query(`select * from articles where article_id=$1`, [id])

    if (validArticleId.rows.length === 0) {
        return Promise.reject({ status: 400, msg: 'no such article' })
    }

    return db.query(`insert into comments
        (article_id,author,body)
        values
        ($1,$2,$3) returning *`, [id, username, body])
        .then(({ rows }) => {
            return rows[0]
        })

}

exports.renewArticle = (id, inc_votes) => {
    return db.query(`update articles 
        set votes = votes + $1
        where article_id=$2
        returning *`, [inc_votes, id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'no such article' })
            }
            if (rows[0].votes < 0) {
                return Promise.reject({ status: 400, msg: 'votes cannot be less than 0' })
            }
            return rows[0]
        })

}
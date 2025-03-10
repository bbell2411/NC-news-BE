const db = require('../db/connection')
exports.fetchArticlesById = (id) => {
    return db.query(`select * from articles where article_id=$1`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'not found' })
            }
            return rows[0]
        })
}
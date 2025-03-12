const db = require('../db/connection')

exports.removeComment = (id) => {
    return db.query(`delete from comments
        where comment_id=$1
        returning *`, [id])
        .then(({ rows }) => {
            if (rows.length===0){
                return Promise.reject({status:404,msg:'comment not found'})
            }
            return rows
        })

}
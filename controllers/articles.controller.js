const { fetchArticlesById, fetchArticles, fetchComments, acceptComment, renewArticle } = require('../models/articles.model')

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query
    const {order}=req.query
    fetchArticles(sort_by,order).then((articles) => {
        res.status(200).send({ articles })
    })
        .catch((err) => {
            next(err)
        })

}
// sort_by, which sorts the articles by any valid column 
// (defaults to the created_at date).
// order, which can be set to asc or desc for
//  ascending or descending (defaults to descending).

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({ article })
    })
        .catch((err) => {
            next(err)
        })
}

exports.getComments = (req, res, next) => {
    const { sort_by } = req.query
    const { article_id } = req.params

    fetchComments(article_id, sort_by).then((comment) => {
        res.status(200).send({ comment })
    })
        .catch((err) => {
            next(err)
        })
}

exports.postComment = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    acceptComment(username, body, article_id).then((postedComment) => {
        res.status(201).send({ postedComment })
    })
        .catch((err) => {
            next(err)
        })
}

exports.updateArticle = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params
    renewArticle(article_id, inc_votes).then((updatedArticle) => {
        res.status(200).send({ updatedArticle })
    })
        .catch((err) => {
            next(err)
        })
}

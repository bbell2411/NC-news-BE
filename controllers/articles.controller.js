const { fetchArticlesById, fetchArticles, fetchComments, acceptComment } = require('../models/articles.model')

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query
    fetchArticles(sort_by).then((articles) => {
        res.status(200).send({ articles })
    })
        .catch((err) => {
            next(err)
        })

}

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
    const {article_id}=req.params
    acceptComment(username,body,article_id).then((postedComment) => {
        res.status(201).send({ postedComment })
    })
    .catch((err) => {
        next(err)
    })
}

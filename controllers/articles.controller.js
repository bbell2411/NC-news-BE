const { fetchArticlesById, fetchArticles } = require('../models/articles.model')

exports.getArticles = (req, res, next) => {
    const {sort_by}=req.query
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
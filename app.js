const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints = require('./endpoints.json')
const {getEndpoints}=require ('./controllers/getEndpoints.controller')

const {handleServerErrors,handleCustomErrors, handlePsqlErrors}=require('./controllers/handlingErrors.controller')

const { getTopics } = require('./controllers/topics.controller')
const { getArticlesById, getArticles, getComments} = require('./controllers/articles.controller')

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles',getArticles)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles/:article_id/comments',getComments)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'path not found' })
})

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app

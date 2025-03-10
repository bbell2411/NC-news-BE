const express = require('express')
const db = require('./db/connection')
const app = express()
const endpoints=require('./endpoints.json')
const {getEndpoints}=require ('./controllers/getEndpoints.controller')

const {getTopics}=require('./controllers/topics.controller')

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

module.exports=app
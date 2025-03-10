const endpoints = require('../endpoints.json')


exports.getEndpoints = (res,req,next) => {
    res.status(200).send({endpoints})
    
}
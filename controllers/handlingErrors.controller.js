
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'bad request' })
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(res.status).send({ msg: err.msg })
    }
    next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    // console.log(err)
    res.status(500).send({ msg: 'not found' })
}
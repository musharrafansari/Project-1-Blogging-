let jwt = require('jsonwebtoken')


let authenticate = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) res.status(401).send({ status: false, msg: 'token must be present in headers' })


        let decoded = jwt.verify(token, "FunctionUp-radon")

        next()

    } catch (err) {
        res.status(500).send({ msg: err })
    }
}

module.exports.authenticate = authenticate
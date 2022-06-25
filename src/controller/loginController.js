const author = require("../model/authorModel")
const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}

///////////////--------------------------------------------



const authorLogin = async function (req, res) {
    try {
        let data = req.body;
        let emails = data.email;
        let password = data.pasword;

        if (!data) {
            res.satus(400).send({ status: false, msg: "There is no data In body to find Author" })
        }

        if (!isValid(emails)) {
            res.status(400).send({ status: false, msg: "Please enter your Email " })
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Please enter your password " })
        }

        let login = await authorModel.findOne({ email: emails, pasword: password })
        if (!login.email) { res.status(400).send({ status: false, msg: 'Invalid email' }) }
        if (!login.pasword) { res.status(400).send({ msg: "Invalid password" }) }
        
        // creating JWt
        let token = jwt.sign(
            {
                UserEmail: login.email,
                UserId: login._id.toString(),
                batch: "radon-Project-1"
            },
            "FunctionUp-radon"
        )
            // res.header('x-api-key',token)
        res.status(200).send({status:true, token:token})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}




module.exports.authorLogin = authorLogin
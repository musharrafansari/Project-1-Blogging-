const author = require("../model/authorModel")
const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");

const authorLogin = async function (req, res) {
    try {
        let data = req.body;
        let emails = data.email;
        let password = data.pasword;

        if (!data) {
            res.stsatus(400).send({ status: false, msg: "There is no data In body to find Author" })
        }
        if (!emails) {
            res.send(400).send({ status: false, msg: "Please Give a Email In body" })
        }
        if (!password) {
            res.send(400).send({ status: false, msg: "Please Give a password In body" })
        }

        let login = await authorModel.findOne({ email: emails, pasword: password })
        if (!login.email) { res.status(400).send({ status: false, msg: 'Invalid email' }) }
        if (!login.pasword) { res.status(400).send({ msg: "Invalid password" }) }
        
        let token = jwt.sign(
            {
                UserEmail: login.email,
                UserId: login._id.toString(),
                batch: "radon-Project-1"
            },
            "FunctionUp-radon"
        )

        res.status(200).send({status:true, token:token})
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}




module.exports.authorLogin = authorLogin
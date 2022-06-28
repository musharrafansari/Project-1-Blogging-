const author = require("../model/authorModel")
const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorModel");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}


///////////////--------------------------------------------author Login-------------------------------------------------////////////////////



const authorLogin = async function (req, res) {
    try {
        let data = req.body;
        let emails = data.email;
        let password = data.pasword;

        if (!data) {
            res.status(400).send({ status: false, msg: "There is no data In body to find Author" })
        }

        if (!isValid(emails)) {
            res.status(400).send({ status: false, msg: "Please enter your Email " })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim()))) 
        { return res.status(400).send({ status: false, msg: "Enter a valid email address." }) }

        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "Please enter your password " })
        }

        let login = await authorModel.findOne({ email: emails, pasword: password })//here we call authorModel db and save the data in login  VARIABLE

        if (!login) { return res.status(404).send({ status: false, msg: "Invalid Login credentials" }) }


        // creating JWt
        let token = jwt.sign(
            {
                UserEmail: login.email,
                UserId: login._id.toString(), //this is payload
                batch: "radon-Project-1"
            },
            "FunctionUp-radon" //this is SECRET KEY
        )

        res.status(200).send({ status: true, token: token })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}




module.exports.authorLogin = authorLogin
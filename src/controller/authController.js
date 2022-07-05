const authorModel = require('../model/authorModel')



const isValidtitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1

}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}

/////---------------------------------------------------------createAuthor---------------------------------------------------------------------


const createAuthor = async function (req, res) {
    
    try {

        let data = req.body
        
        const{fname,lname,email,title,pasword}=data

        if (!Object.keys(data).length) { return res.status(400).send({ status: false, msg: "You must enter data." }) }


        /******validation of author ****/

        if (!(fname)) { return res.status(400).send({ status: false, msg: "fname is mandatory" }) }

        if (!(/^[a-zA-Z]+$/.test(data.fname.trim()))) { return res.status(400).send({ status: false, msg: "Enter a valid First name." }) }

        if (!lname) { return res.status(400).send({ status: false, msg: "lname is mandatory" }) }

        if (!(/^[a-zA-Z]+$/.test(data.lname.trim()))) { return res.status(400).send({ status: false, msg: "Enter a valid Last name." }) }

        if (!email) { return res.status(400).send({ status: false, msg: "email is mandatory" }) }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim()))) { return res.status(400).send({ status: false, msg: "Enter a valid email address." }) }

        let validEmail = await authorModel.findOne({ email})
        // console.log(validEmail, 41)
        if (validEmail) return res.status(400).send({ status: false, msg: `${email} Already email exist ` })

        if (!(pasword)) { return res.status(400).send({ status: false, msg: "password is mandatory" }) }
       
        if (!isValid(pasword)) { return res.status(400).send({ status: false, msg: "Enter valid password" }) }

        if (!title) { return res.status(400).send({ status: false, msg: "title is mandatory" }) }

        if (!isValidtitle(title)) { return res.status(400).send({ status: false, msg: 'Enter valid enum  ["Mr", "Mrs", "Miss"]' }) }

        let created = await authorModel.create(data)
        // console.log(created,51);
        res.status(201).send({ status: true, data: created })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }

}

module.exports.createAuthor = createAuthor
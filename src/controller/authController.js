const authModel = require('../model/authorModel')

const createAuthor =  async function(req,res) {
  try{
   
    let data = req.body
    if(!Object.keys(data).length) 
        return res.status(400).send({status: false, msg: "You must enter data."})

    if(!data.fname) {return res.status(400).send({status:false,msg:"fname is mandatory"})}

    if(!data.fname.trim().match(/^[a-zA-Z]+$/)) 
        {return res.status(400).send({status: false, msg: "Enter a valid First name."})}

    if (!data.lname) { return res.status(400).send({ status: false, msg: "lname is mandatory" }) }

    if(!(/^[a-zA-Z]+$/.test(data.lname.trim()))) 
        {return res.status(400).send({status: false, msg: "Enter a valid Last name."})}


    if (!data.email) { return res.status(400).send({ status: false, msg: "email is mandatory" }) }


    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())))
       { return res.status(400).send({status: false, msg: "Enter a valid email address."})}

    if (!data.pasword) { return res.status(400).send({ status: false, msg: "password is mandatory" }) }

    if (!data.title) { return res.status(400).send({ status: false, msg: "title is mandatory" }) }
   
    let created = await author.create(data)
    res.status(201).send({status: true, data: created})
}
catch(err){
    console.log(err.message)
    res.status(500).send({status: false, msg: err.message})
}
}




module.exports.createAuthor = createAuthor
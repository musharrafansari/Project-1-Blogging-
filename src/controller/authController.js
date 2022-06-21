const authModel = require('../model/authorModel')

const createAuthor = async function(req,res) {
try{
let data = req.body

if(!Object.keys(data).length  ){
  res.status(400).send({ status: false, msg: "Author data required"})
}    


let savedata = await authModel.create(data)

res.status(201).send({status: true, msg: savedata})
}catch(err){
    res.status(500).send({status: false, msg: 'server not respond'})
}

}

module.exports.createAuthor = createAuthor
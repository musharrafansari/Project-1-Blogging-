const authModel = require('../model/authorModel')

const createAuthor =  async function(req,res) {
// // try{
// let data = req.body

// if(Object.keys(data).length!=0){
//   let savedata = await authModel.create(data)
//   res.send({status: true,msg: savedata})
// }    

//  else{
// res.send("Author data is required")
// }

// // }catch(err){
// //     res.status(500).send({status: false, msg: 'server not respond'})
// // }
try{
    let data = req.body
  
    if (!data.fname) { return res.status(400).send({ status: false, msg: "fname is mandatory" }) }
    if (!data.lname) { return res.status(400).send({ status: false, msg: "lname is mandatory" }) }
    if (!data.email) { return res.status(400).send({ status: false, msg: "email is mandatory" }) }
    if (!data.pasword) { return res.status(400).send({ status: false, msg: "password is mandatory" }) }
    if (!data.title) { return res.status(400).send({ status: false, msg: "title is mandatory" }) }
    // if (data.title!="Mr"||data.title!="Mrs"||data.title!="Miss") { return res.status(400).send({ status: false, msg: "title is enumerated choose among (mr , mrs , miss)" }) }
    
    let savedata = await authModel.create(data)
    res.status(201).send({ status: true, msg: savedata })
  
    } catch(err){
        res.status(500).send({status: false, msg:err.message})
    }

}


module.exports.createAuthor = createAuthor
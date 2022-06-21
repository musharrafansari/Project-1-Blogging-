const authModel = require('../model/authorModel')

const createAuthor =  async function(req,res) {
// try{
let data = req.body

if(Object.keys(data).length!=0){
  let savedata = await authModel.create(data)
  res.send({status: true,msg: savedata})
}    

 else{
res.send("Author data is required")
}

// }catch(err){
//     res.status(500).send({status: false, msg: 'server not respond'})
// }

}


module.exports.createAuthor = createAuthor
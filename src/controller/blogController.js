const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");


const createBlog = async function(req,res){
  let data = req.body
  let id = data.authorId
 console.log(id)
  let authorId = await authorModel.findById(id).select({_id:1})
  let authId = authorId._id.toString()
  console.log(authId)
  
  // if(!Object.keys(data).length){
  //   res.send({status:false,msg:"blog data required"})
  // }  
  // else{
  //   if(!id){
  //       res.send("authorId Is required")
  //   }
  //   else{
  //      if(id!=authId) {res.send("Invalid Author")}

  //      else{
        let saveData = await blogModel.create(data)
        res.send({status:true, msg:saveData})
       }

     
//     }
//   }
// }

module.exports.createBlog = createBlog
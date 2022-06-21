const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");


const createBlog = async function(req,res){
  let data = req.body
  let id = data.authorId
 
  let authorId = await authorModel.findById(id).select({_id:1})
  let authId = authorId._id.toString()
  
  if(Object.keys(data).length==0){
    res.send({status:false,msg:"blog data required"})
  }  
  else{
    if(!id){
        res.send("authorId Is required")
    }
    else{
       if(id!=authId) {res.send("Invalid Author")}

       else{
        let saveData = await blogModel.create(data)
        res.send({status:true, msg:saveData})
       }

     
    }
  }
}
const getBlogs = async function (req, res) {
    try {
      let data = req.query;
  
      
      let GetRecord = await blogModel.find({
        $and: [{ isPublished: true, isDeleted: false, ...data }], 
      })
      if (GetRecord.length == 0) {
        return res.status(404).send({
          data: "No such document exist with the given attributes.",
        });
      }
      res.status(200).send({ status: true, data: GetRecord });
    } catch (err) {
      res.status(500).send({ status: false, data: err.message });
    }
  };

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
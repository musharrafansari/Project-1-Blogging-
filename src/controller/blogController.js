const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");


const createBlog = async function(req,res){
  try{
  let data = req.body
  let id = data.authorId
 
  let authorId = await authorModel.findById(id)
  
  
  if(Object.keys(data).length==0){
       return res.status(400).send({status:false,msg:"blog data required"})
  }  

  if(!data.title)
               { return res.status(400).send({status: false, msg: "Title must be present."})}

  if(!data.body)
                {return res.status(400).send({status: false, msg: "Body must be present."})}
  if(!id)
                {return res.status(400).send({status: false, msg: "AuthorId must be present."})}

    
  if(id!=authorId._id)
              {return res.status(400).send("Invalid Author")}
  if(!data.category)
              {return res.status(400).send({status: false, msg: "Category must be present."})}

       
        let saveData = await blogModel.create(data)
        res.status(201).send({status:true, msg:saveData})
    
      
      
    }
  
  

catch(err){

  res.status(500).send({status:false,msg:err.message})
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
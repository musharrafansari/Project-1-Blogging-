const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
var mongoose = require('mongoose');

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
  const updateBlogs = async function(req,res){
     try{
      let data = req.body;
      let blogId =req.params.blogId+"";
      // console.log(blogId)
      if(Object.keys(data).length==0){
        res.status(400).send({status:false,msg:"Data must be provided for update"})
      }
      let blog_Id = await blogModel.findById(blogId)
      
      if(!blog_Id){
        res.status(400).send({status:false,msg:"Invalid blog Id"})
      }
      let findBlog = await blogModel.findOne({_id:blogId,isDeleted:false})
      if(!findBlog){
        res.status(400).send({status:false,msg:"No such Document"})
      }
      let updatedBlog = await blogModel.findOneAndUpdate({_id:blogId,isDeleted:false},{$set:{title:data.title,tags:data.tags,subcategory:data.subcategory,body:data.body,publishedAt:Date.now(),isPublished:true}},{new:true})
      res.status(200).send({status:true,msg:updatedBlog})
    }
    catch(err){
      res.status(500).send({status:false,msg:err.message})
    }
  }

  const deleteBlogs = async (req, res) => {
    try{
        let data = req.params.blogId+""
        if(!data) {
            return res.status(400).send({status:false, msg:'Invalid Blog objectId.'}) 
        }
        
        let deletedBlog = await blogModel.findOneAndUpdate({_id:data,isDeleted:false},{isDeleted:true, deletedAt: Date.now()},{new:true})
        if(!deletedBlog){
            return res.status(404).send({status:false, msg:"No Document found."})
        }
        res.status(200).send({status:true,msg:"Deleted Done"});
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status:false, msg: err.message})
    }
}


module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlogs = deleteBlogs
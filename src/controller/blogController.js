const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require('jsonwebtoken');
// const { json } = require("body-parser");
const mongoose = require('mongoose')
var ObjectId = require('mongoose').Types.ObjectId;
// const lodash = require('lodash')


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  if (typeof value === Number && value.trim().length === 0) return false
  return true
}

function validateObjectId(id)
{
    var bool=false; 
    if(id.length==24) bool=/[a-f]+/.test(id);
    return bool;
}


///////////////-----------------------------------------create Blog------------------------------------

const createBlog = async function (req, res) {
  try {
    let data = req.body
   
    const { title, body,authorId, category } = data

    let authId = await authorModel.findById({_id:authorId})
    // let authorId = Id._id.toString()
    console.log(authId);
if (!authId) { return res.status(400).send({ status: false, msg: "AuthorId doesn't exist." }) }

    

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "blog data required" })
    }

    // if (!new ObjectId(id)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' }) }


    if (!isValid(data.title)) { return res.status(400).send({ status: false, msg: "Title must be present." }) }

    if (!isValid(data.body)) { return res.status(400).send({ status: false, msg: "Body must be present." }) }
    // if (!authorId) { return res.status(400).send({ status: false, msg: "AuthorId must be present." }) }

    //*************************** */

    if (!authorId) return res.status(400).send({status:false ,msg:'Author Id must be present'})

    
  //  if(!validateObjectId(authorId))return res.status(400).send({status:false ,msg:'Author Id not valid'})

      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
    
    //**************************** */

    // console.log(id,authorId);
    // if (!authId) { return res.status(400).send({ msg: "Invalid Author id" }) }
    if (!isValid(data.category)) { return res.status(400).send({ status: false, msg: "Category must be present." }) }


    let saveData = await blogModel.create(data)
    res.status(201).send({ status: true, msg: saveData })



  }
  catch (err) {

    res.status(500).send({ status: false, msg: err.message })
  }
}



/////----------------------------------------------------------------------getBlogs---------------------------------
const getBlogs = async function (req, res) {
  try {

    let data = req.query;
    let filter = {
      isdeleted: false,
      isPublished: true,
      ...data
    };

    const { authorId, category, tags, subcategory } = data

    if (category) {
      let verifyCategory = await blogModel.findOne({ category: category })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this category exist' })
      }
    }
    if (tags) {
      let verifyTag = await blogModel.findOne({ tags: tags })
      if (!verifyTag) {
        return res.status(400).send({ status: false, msg: 'No blogs in this tags exist' })
      }
    }
    if (subcategory) {
      let verifyCategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: 'No blogs in this subcategory exist' })
      }
    }


    if (authorId) {
      if (!mongoose.isValidObjectId(authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })
    }

    let GetRecord = await blogModel.find(filter)
    // console.log(GetRecord);

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

////////////----------------------------------------------------------updateBlog---------------------------------------



const updateBlogId = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;
    // console.log(blogId)

    const { title, body, tags, subcategory } = data

    if (title) {
      if (!isValid(title)) return res.status(400).send({ status: false, msg: 'Please enter a title ' })
    }
    if (body) {
      if (!isValid(body)) return res.status(400).send({ status: false, msg: 'Please fill data into body ' })
    }
    if (tags) {
      if (!isValid(tags)) return res.status(400).send({ status: false, msg: 'Please fill data into tags ' })
    }
    if (subcategory) {
      if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: 'Please fill data into subcategory ' })
    }

    if (Object.keys(data).length == 0) {
      res.status(400).send({ status: false, msg: "Data must be provided for update" })
    }
    if (!ObjectId.isValid(blogId)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of blog Id' }) }

    let blog_Id = await blogModel.findById(blogId)
    // console.log(blog_Id);
    if (!blog_Id) {
      res.status(400).send({ status: false, msg: " blog Id not found" })
    }
    let findBlog = await blogModel.findOne({ _id: blogId, isDeleted: false })

    if (!findBlog) {
      res.status(404).send({ status: false, msg: "No such Document" })
    }

    ////////////////////------------------------------authorization-----------------------------------------------------

    const token = req.headers['x-api-key']
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(200).send({ status: true, msg: 'You are not authrized' })
    }


    //////////////////////-----------------------------------------------------------------------------

    let pushData = { tags: data.tags, subcategory: data.subcategory }


    let up = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { title: data.title, body: data.body, publishedAt: Date.now(), isPublished: true } }, { new: true })

    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $push: pushData }, { new: true })
    res.status(200).send({ status: true, data: updatedBlog });

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}

///----------------------------------------------------------------deletedBlog-----------------------------------


const deleteByBlogId = async function (req, res) {
  try {
    let data = req.params.blogId
    // let Id = data.blogId
    if (!data) { return res.status(400).send({ status: false, msg: "Data must be provided " }) }

    if (!ObjectId.isValid(data)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of blog Id' }) }

    let BlogId = await blogModel.findById(data)
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter valid blogId" })
    }

    ////////////////////------------------------------authorization-----------------------------------

    const token = req.headers['x-api-key']
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(200).send({ status: true, msg: 'You are not authrized' })
    }


    //////////////////////----------------------------------------------------------------------------



    let deletedBlog = await blogModel.findOneAndUpdate({ _id: data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
    // console.log(deletedBlog);
    if (!deletedBlog) {
      return res.status(404).send({ status: false, msg: "No Document found or Document has been already deleted" }) // edit Blog is deleted
    }
    // if(deletedBlog.isDeleted){ res.status(400).send({status:false ,msg: 'Blog is deleted'})}

    res.status(200).send({ status: true, msg: deletedBlog })





  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}



//////////////////----------------------------------------------deleteBlogbyquery-------------------------------------------------


const deleteBlogbyquery = async function (req, res) {
  try {
    let data = req.query


    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please select some key for deletion." })


    ////////////////////------------------------------authorization-------------------------------------------------------------

    // const token = req.headers['x-api-key']
    // if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    // let decodedToken = jwt.verify(token, "FunctionUp-radon")

    // let blog = await blogModel.find(data).select({ authorId: 1, _id: 0 })

    // let p = JSON.parse(JSON.stringify(blog))

    // console.log(p, '205');

    // let authArr = [];

    // p.map(item => {

    //   console.log(authId, '199');
    //   authArr.push(item.authorId);
    //   console.log(authArr, '201');
    //   // console.log(decodedToken.UserId);

    // })

    // for (let i = 0; i < authArr.length; i++) {
    //   if (decodedToken.UserId != authArr[i]) {

    //     res.status(403).send({ status: false, msg: 'You are not authorized for ' + authArr[i] })



    //   } else {
    //     let blogs = await blogModel.updateMany({ data, isDeleted: false, isPublished: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
    //     if (!blogs.modifiedCount)
    //       return res.status(404).send({ status: false, msg: "No documents Modified" })

    //     res.status(200).send({ status: true, msg: `Total deleted document count:${blogs.modifiedCount}` })
    //     console.log(blogs)
    //   }

    // }

    //////////////////////---------------------------------------------------------------------------------------------------

    let blogs = await blogModel.updateMany({ data, isDeleted: false, isPublished: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
    if (!blogs.modifiedCount)
      return res.status(404).send({ status: false, msg: "No documents Modified" })

    res.status(200).send({ status: true, msg: `Total deleted document count:${blogs.modifiedCount}`, data: blogs })
    console.log(blogs)


  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}





module.exports.createBlog = createBlog

module.exports.getBlogs = getBlogs

module.exports.updateBlogId = updateBlogId

module.exports.deleteByBlogId = deleteByBlogId

module.exports.deleteBlogbyquery = deleteBlogbyquery 
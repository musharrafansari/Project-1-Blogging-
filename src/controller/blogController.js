const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require('jsonwebtoken')


///////////////----------------------------------------------------create Blog-------------

const createBlog = async function (req, res) {
  try {
    let data = req.body
    let id = data.authorId

    let authorId = await authorModel.findById(id)
    // let authorId = Id._id.toString()
    //  console.log( authorId);

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "blog data required" })
    }

    if (!data.title) { return res.status(400).send({ status: false, msg: "Title must be present." }) }

    if (!data.body) { return res.status(400).send({ status: false, msg: "Body must be present." }) }
    if (!id) { return res.status(400).send({ status: false, msg: "AuthorId must be present." }) }


    // console.log(id,authorId);
    if (!authorId) { return res.status(400).send({ msg: "Invalid Author id" }) }
    if (!data.category) { return res.status(400).send({ status: false, msg: "Category must be present." }) }


    let saveData = await blogModel.create(data)
    res.status(201).send({ status: true, msg: saveData })



  }
  catch (err) {

    res.status(500).send({ status: false, msg: err.message })
  }
}



/////----------------------------------------------------------------------getBlogs-------------------
const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    // console.log(data);

    let GetRecord = await blogModel.find({
      $and: [{ isPublished: true, isDeleted: false, ...data }]

    })
    console.log(GetRecord);

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
    if (Object.keys(data).length == 0) {
      res.status(400).send({ status: false, msg: "Data must be provided for update" })
    }
    let blog_Id = await blogModel.findById(blogId)
    console.log(blog_Id);
    if (!blog_Id) {
      res.status(400).send({ status: false, msg: " blog Id not found" })
    }
    let findBlog = await blogModel.findOne({ _id: blogId, isDeleted: false })

    if (!findBlog) {
      res.status(400).send({ status: false, msg: "No such Document" })
    }

    if (findBlog.isDeleted) { res.status(400).send({ status: false, msg: 'Blog is deleted' }) }

    ////////////////////------------------------------authorization---------------------------

    const token = req.headers['x-api-key']
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(200).send({ status: true, msg: 'You are not authrized' })
    }


    //////////////////////-------------------------------------------------------------------------


    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { title: data.title, tags: data.tags, subcategory: data.subcategory, body: data.body, publishedAt: Date.now(), isPublished: true } }, { new: true })
    res.status(200).send({ status: true, msg: updatedBlog })
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

    let BlogId = await blogModel.findById(data)
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter valid blogId" })
    }

    ////////////////////------------------------------authorization---------------------------

    const token = req.headers['x-api-key']
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(200).send({ status: true, msg: 'You are not authrized' })
    }


    //////////////////////-------------------------------------------------------------------------



    let deletedBlog = await blogModel.findOneAndUpdate({ _id: data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
    // console.log(deletedBlog);
    if (!deletedBlog) {
      return res.status(404).send({ status: false, msg: "No Document found." })
    }
    // if(deletedBlog.isDeleted){ res.status(400).send({status:false ,msg: 'Blog is deleted'})}

    res.status(200).send({ status: true, msg: deletedBlog })





  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}



//////////////////----------------------------------------------deleteBlogbyquery---------


const deleteBlogbyquery = async function (req, res) {
  try {
    let data = req.query


    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please select some key for deletion." })


    let blogs = await blogModel.updateMany({ data, isDeleted: false, isPublished: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
    if (!blogs.modifiedCount)
      return res.status(404).send({ status: false, msg: "No documents Modifued" })

    res.status(200).send({ status: true, msg: `Total deleted document count:${blogs.modifiedCount}` })
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
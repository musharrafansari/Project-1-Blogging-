const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId



const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  if (typeof value === Number && value.trim().length === 0) return false
  return true
}


///////////////-----------------------------------------create Blog-------------------------------------------------------

const createBlog = async function (req, res) {
  try {
    let data = req.body

    const { authorId,title,body,category,subcategory,tags } = data // Object destructuring

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "blog data required" })
    }

    if (!(title)) { return res.status(400).send({ status: false, msg: "Title must be present." }) }
    if (!isValid(title)) { return res.status(400).send({ status: false, msg: "Enter valid title." }) }

    if (!(body)) { return res.status(400).send({ status: false, msg: "Body must be present." }) }
    if (!isValid(body)) { return res.status(400).send({ status: false, msg: "Enter valid body." }) }

    if (!authorId) return res.status(400).send({ status: false, msg: 'Author Id must be present' })

    if (!mongoose.isValidObjectId(authorId))
      return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId' })
      //  console.log(mongoose, 37);


    let authId = await authorModel.findById(authorId)

    if (!authId) { return res.status(400).send({ status: false, msg: "AuthorId doesn't exist." }) }

    if (!(data.category)) { return res.status(400).send({ status: false, msg: "Category must be present." }) }
    if (!isValid(data.category)) { return res.status(400).send({ status: false, msg: "Enter valid category." }) }

    let saveData = await blogModel.create(data)

    res.status(201).send({ status: true, msg: "Blog Created Successfully", saveData })
}
  catch (err) {

    res.status(500).send({ status: false, msg: err.message })
  }
}



/////----------------------------------------------------------------------getBlogs---------------------------------------------
const getBlogs = async function (req, res) {
  try {

    let data = req.query;
    let filter = {
      isDeleted: false,
      isPublished: true,
      ...data
    };

    const { authorId, category, tags, subcategory } = data

    if (category) {
      let verifyCategory = await blogModel.find({ category: category,tags: tags ,subcategory: subcategory ,authorId:authorId })
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
    if (GetRecord.length == 0) {
      return res.status(404).send({ data: "No such document exist with the given attributes."});
    }

    res.status(200).send({ status: true, data: GetRecord });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
};

////////////----------------------------------------------------------updateBlog------------------------------------------------



const updateBlogId = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;


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
     return res.status(400).send({ status: false, msg: "Data must be provided for update" })
    }
    if (!ObjectId.isValid(blogId)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of blog Id' }) }

    let blog_Id = await blogModel.findById(blogId)

    if (!blog_Id) {
      return res.status(400).send({ status: false, msg: " blog Id not found" }) 
    }
    let findBlog = await blogModel.findOne({ _id: blogId, isDeleted: false })

    if (!findBlog) {
      res.status(404).send({ status: false, msg: "No such Document found" })
    }

    ////////////////////------------------------------authorization-----------------------------------------------------------

    const token = req.headers['x-api-key'] //we call headers with name x-api-key
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(403).send({ status: false, msg: 'You are not authrized' })
    }


    //////////////////////-----------------------------------------------------------------------------------------------------



    let pushData = { tags: data.tags, subcategory: data.subcategory }


    let up = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { title: data.title, body: data.body, publishedAt: Date.now(), isPublished: true } }, { new: true })

    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $push: pushData, }, { new: true })
    res.status(200).send({ status: true, data: updatedBlog });

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}

///----------------------------------------------------------------deletedBlog-------------------------------------------------


const deleteByBlogId = async function (req, res) {
  try {
    let data = req.params.blogId
    // let Id = data.blogId
    if (!data) { return res.status(400).send({ status: false, msg: "BlogId  must be provided " }) }

    if (!ObjectId.isValid(data)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of blog Id' }) }

    let BlogId = await blogModel.findById(data)
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter valid blogId" })
    }

    ////////////////////------------------------------authorization-------------------------------------------------------------

    const token = req.headers['x-api-key']
    if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    let decodedToken = jwt.verify(token, "FunctionUp-radon")

    let blog = req.params.blogId
    let userId = decodedToken.UserId

    let blogData = await blogModel.findOne({ _id: blog })

    if (blogData.authorId.toString() != userId) {
      return res.status(200).send({ status: true, msg: 'You are not authrized' })
    }


    //////////////////////------------------------------------------------------------------------------------------------------



    let deletedBlog = await blogModel.findOneAndUpdate({ _id: data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

    if (!deletedBlog) {
      return res.status(404).send({ status: false, msg: "No Document found or Document has been already deleted" }) // edit Blog is deleted
    }


    res.status(200).send({ status: true, msg: deletedBlog })


  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}



//////////////////----------------------------------------------deleteBlogbyquery---------------------------------------------------


const deleteBlogbyquery = async function (req, res) {
  try {
    let data = req.query


    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please select some key for deletion." })
    if (data.category) {
      if (!isValid(data.category)) {
        res.status(400).send({ status: false, msg: "Invalid Category " })
      }
    }
    if (data.title) {
      if (!isValid(data.title)) {
        res.status(400).send({ status: false, msg: "Invalid title " })
      }
    }
    if (data.subcategory) {
      if (!isValid(data.subcategory)) {
        res.status(400).send({ status: false, msg: "Invalid subcategory" })
      }
    }

    
      if (!data.authorId) {return res.status(400).send({ status: false, msg: 'Author Id must be present' })}

      if (!mongoose.isValidObjectId(data.authorId))
        return res.status(400).send({ status: false, msg: 'Please enter correct length of AuthorId Id' })

      let authId = await authorModel.findById(data.authorId)

      if (!authId) { return res.status(400).send({ status: false, msg: "AuthorId doesn't exist." }) }
    
/////////////////////////////////////////////

    // const token = req.headers['x-api-key'] //we call headers with name x-api-key
    // if (!token) res.status(401).send({ status: false, msg: "missing a mandatory token😒" })
    // let decodedToken = jwt.verify(token, "FunctionUp-radon")

    // let author = req.query.authorId
    // let userId = decodedToken.UserId
 
    // let authorData = await blogModel.findOne({ _id: author })

    // if (authorData.authorId.toString() != userId) {
    //   return res.status(403).send({ status: false, msg: 'You are not authrized' })
    // }

    /////////////////////////////////////////////////

    let blogs = await blogModel.updateMany({ data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

    if (!blogs.modifiedCount)
      return res.status(404).send({ status: false, msg: "No documents Found" })

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
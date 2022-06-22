const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
// const ObjectId = mongoose.Schema.Types.ObjectId;


// const createBlog = async function (req, res) {
//   let data = req.body
//   let id = data.authorId

//   let authorId = await authorModel.findById(id).select({ _id: 1 })
//   let authId = authorId._id.toString()


//   if (!Object.keys(data).length) {
//     res.send({ status: false, msg: "blog data required" })
//   }

//   if (!id) {
//     res.send("authorId Is required")
//   }
//   else {
//     if (id != authId) { res.send("Invalid Author") }

//     else {
//       let saveData = await blogModel.create(data)
//       res.send({ status: true, msg: saveData })
//     }


//   }

// }



///////////////----------------------------------------------------

const createBlog = async function (req, res) {
  try {
    let data = req.body
    let id = data.authorId

    let authorId = await authorModel.findById(id)


    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "blog data required" })
    }

    if (!data.title) { return res.status(400).send({ status: false, msg: "Title must be present." }) }

    if (!data.body) { return res.status(400).send({ status: false, msg: "Body must be present." }) }
    if (!id) { return res.status(400).send({ status: false, msg: "AuthorId must be present." }) }


    if (id != authorId._id) { return res.status(400).send("Invalid Author") }
    if (!data.category) { return res.status(400).send({ status: false, msg: "Category must be present." }) }


    let saveData = await blogModel.create(data)
    res.status(201).send({ status: true, msg: saveData })



  }
  catch (err) {

    res.status(500).send({ status: false, msg: err.message })
  }
}



/////----------------------------------------------------------------------
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

///----------------------------------------------------------------


const deleteByBlogId = async function (req, res) {
  try {
    let data = req.params.blogId
    // let Id = data.blogId
    let BlogId = await blogModel.findById(data)
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter valid blogId" })
    } else {

      // BlogId.isDeleted = true
      // let deleteBlog = await blogModel.create(BlogId)

      let deleteBlog = await blogModel.findOneAndUpdate({ _id: data }, { isDeleted: true,  deletedAt:Date.now() }, { new: true })
      res.status(200).send({ status: true, msg: deleteBlog })
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}

////////////----------------------------------------------------------


const updatebyBlogId = async function(req,res){
try{
  let data = req.body 

  let Id = req.params.blogId+""
  let BlogId = await blogModel.findById(Id)
  if(!BlogId) {
    res.status(404).send({status:false, msg:"BlogId required"})
  }

  let updateBlog = await blogModel.findOneAndUpdate({_id:Id}, data)
res.send(201).send({status:true, msg : updateBlog})
}catch(err){
  res.status(500).send({status:false, msg: err})
}
}





module.exports.createBlog = createBlog

module.exports.getBlogs = getBlogs

module.exports.deleteByBlogId = deleteByBlogId

module.exports.updatebyBlogId= updatebyBlogId

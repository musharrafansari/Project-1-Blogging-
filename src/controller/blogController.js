const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
// const ObjectId = mongoose.Schema.Types.ObjectId;

const createBlog = async function (req, res) {
  let data = req.body
  let id = data.authorId

  let authorId = await authorModel.findById(id).select({ _id: 1 })
  let authId = authorId._id.toString()


  if (!Object.keys(data).length) {
    res.send({ status: false, msg: "blog data required" })
  }

  if (!id) {
    res.send("authorId Is required")
  }
  else {
    if (id != authId) { res.send("Invalid Author") }

    else {
      let saveData = await blogModel.create(data)
      res.send({ status: true, msg: saveData })
    }


  }

}


const deleteByBlogId = async function (req, res) {
  try {
    let data = req.params
    let Id = data.blogId
    let BlogId = await blogModel.findById(Id)
    if (!BlogId) {
      res.status(404).send({ msg: "Please enter blogId" })
    } else {

      // BlogId.isDeleted = true
      // let deleteBlog = await blogModel.create(BlogId)

      let deleteBlog = await blogModel.findOneAndUpdate({ _id: Id }, { isDeleted: true }, { new: true })
      res.status(200).send({ status: true, msg: deleteBlog })
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: "Server error" })
  }
}




module.exports.createBlog = createBlog

module.exports.deleteByBlogId = deleteByBlogId
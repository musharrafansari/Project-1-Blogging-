const express = require('express');

const router = express.Router();

const authController = require('../controller/authController')

const blogController = require("../controller/blogController")

const loginController = require("../controller/loginController")

const auth1 = require("../middleware/authentication")


/// Phase 1
router.post('/authors', authController.createAuthor)

router.post("/blogs", auth1.authenticate, blogController.createBlog)

router.get("/blogs", auth1.authenticate, blogController.getBlogs)

router.put('/blogs/:blogId', auth1.authenticate, blogController.updateBlogId)

router.delete('/blogs/:blogId', auth1.authenticate, blogController.deleteByBlogId)

router.delete('/blogs', auth1.authenticate, blogController.deleteBlogbyquery)



/// Phase 2
router.post('/login', loginController.authorLogin)


module.exports = router;

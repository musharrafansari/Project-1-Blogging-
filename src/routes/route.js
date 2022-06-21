const express = require('express');

const router = express.Router();

const authController = require('../controller/authController')
const blogController = require("../controller/blogController")


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/creatAuthor', authController.createAuthor)
router.post("/createBlog",blogController.createBlog)

module.exports = router;
// adding this comment for no reason
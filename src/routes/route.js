const express = require('express');

const router = express.Router();

const authController = require('../controller/authController')


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

router.post('/creatAuthor', authController.createAuthor)

module.exports = router;
// adding this comment for no reason
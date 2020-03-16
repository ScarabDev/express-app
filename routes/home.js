const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // res.send('Hello, World!!');
    res.render('index.pug', {title: 'My Express App', message: 'Hello, World!!!'});
});

module.exports = router;
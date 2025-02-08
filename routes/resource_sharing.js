const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    console.log(req.user);
    res.render('resource_sharing');
});

module.exports = router;
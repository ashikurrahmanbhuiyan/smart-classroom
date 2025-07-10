const express = require('express');
const { checkAuthenticatedteacher } = require('../config/auth');
const router = express.Router();
const multer = require('multer');
const Resource = require('../models/resources');

router.get('/', async (req, res) => {
    // console.log(req.user.name);
    course_name = req.query.course_name;
    res.render('course_pages/resource_sharing', { page: 'resource_sharing', course_name: course_name });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// POST route to add a resource
router.post('/resources', upload.single('resourceFile'), (req, res) => {
    try {
        const { resourceTitle, resourceDescription, resourceType, resourceUrl } = req.body;

        // If there's a file, get its filename
        const uploadedFile = req.file ? req.file.filename : null;

        const newResource = {
            title: resourceTitle,
            description: resourceDescription,
            type: resourceType,
            url: resourceUrl || null,
            file: uploadedFile || null,
            uploadDate: new Date().toISOString().split('T')[0]
        };

        // For now, just log it and send back as if it was saved
        // console.log("New Resource:", newResource);

        // // Send fake saved object
        // res.status(201).json({
        //     ...newResource,
        //     _id: Date.now().toString() // Simulated DB ID
        // });
        // Save the resource to the database
        const resource = new Resource(newResource);
        resource.save()
            .then(savedResource => {
                res.status(201).json(savedResource);
            })
            .catch(err => {
                console.error("Error saving resource:", err);
                res.status(500).json({ message: "Server error while saving resource." });
            });


    } catch (err) {
        console.error("Error saving resource:", err);
        res.status(500).json({ message: "Server error while saving resource." });
    }
});
  

module.exports = router;
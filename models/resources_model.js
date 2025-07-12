const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['pdf', 'video', 'image', 'zip', 'doc', 'link', 'other'],
        required: true
    },
    url: {
        type: String,
        default: null
    },
    file: {
        type: String, // filename saved by multer
        default: null
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // optional
        default: null
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // optional
        default: null
    }
});

module.exports = mongoose.model('Resource', resourceSchema);

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const testSchema = new mongoose.Schema({    
    domain: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "UserModel"
    },
    filePath: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    versionKey: false
})

mongoose.model("TestModel", testSchema);
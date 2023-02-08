const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const completedTestSchema = new mongoose.Schema({
    filePath: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "UserModel"
    }
})

mongoose.model("CompletedTestModel", completedTestSchema);

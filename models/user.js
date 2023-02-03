const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    tests: {
        testId: {
            type: ObjectId,
            ref: "TestModel"
        },
        startDate: String,
        endDate: String
    },
    versionKey: false
})

mongoose.model("UserModel", userSchema);
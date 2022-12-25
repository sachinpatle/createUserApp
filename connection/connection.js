const mongoose = require('mongoose');
const mongourl = "mongodb+srv://newUser:sachinit15017@cluster0.uqohn5a.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', false)
mongoose.connect(mongourl).then(() => {
    console.log("connected to the mongoose");
}).catch((err) => {
    console.log("mongodb error", err);
});



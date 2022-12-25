const express = require('express');
const bcryptjs = require('bcryptjs');
const { default: mongoose } = require('mongoose');

const app = express();


require('./connection/connection');
require('./models/user');

const requireLogin = require('./middleware/loginRequired');


app.use(express.json());

const User = mongoose.model("UserModel");


const userData = [];

const PORT  = process.env.PORT  || 3000

app.get('/getUser', (req, res) => {
    res.json(userData);
})

app.post('/createUser', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((result) => {
            if (result) {
                return res.status(400).json({ error: "User already existed with that email" });
            }
            bcryptjs.hash(password, 12).then((hashedpassword) => {
                const user = new User({
                    name,
                    password: hashedpassword,
                    email,
                    role: parseInt(role)
                })
                user.save().then(result => {
                    res.json({ user: result });
                }).catch(err => {
                    console.log("err save", err);
                })
            }).catch((err) => {
                console.log("bcrypt err", err);
            });
        })
        .catch((err) => {
            console.log("err", err);
        })
})

app.patch('/editUser', requireLogin,(req, res) => {
    User.findByIdAndUpdate(req.body.id, {
        name: req.body.name, role: req.body.role
    },
        {
            new: true
        }
    )
        .exec((err, result) => {
            if (err) return res.status(400).json({ error: err })
            res.json(result);
        })
})



app.listen(3000, () => {
    console.log("server is running on port = ",PORT);
})

// mongodb+srv://sachinpatle:<sachinit15017>@cluster0.uqohn5a.mongodb.net/?retryWrites=true&w=majority
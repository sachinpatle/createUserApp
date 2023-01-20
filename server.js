const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const JWT_SECRET = "ererjjfdkfndfdkfjdfsaadofk";
const router = express.Router();

const app = express();
const _ = require("underscore");


require('./connection/connection');
require('./models/user');
require('./models/test');
const { createNewMeeting } = require("./meetings_model");

const requireLogin = require('./middleware/loginRequired');


app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


const User = mongoose.model("UserModel");
const Test = mongoose.model("TestModel");


const userData = [];

const PORT = process.env.PORT || 3000

app.get('/getUser', (req, res) => {
    res.json(userData);
})

app.post('/createUser', (req, res) => {
    const { userName, email, password, role } = req.body;
    if (!userName || !email || !password || !role) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((result) => {
            if (result) {
                return res.status(400).json({ error: "User already existed with that email" });
            }
            bcryptjs.hash(password, 12).then((hashedpassword) => {
                const user = new User({
                    userName,
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

app.delete('/deleteUser', (req, res) => {
    User.findOne({ _id: req.body.id })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(422).json({ error: err })
            }
            user.remove()
                .then(result => {
                    res.json(result)
                }).catch(err => {
                    console.log(err)
                })
        })
})


app.get("/allUser", (req, res) => {
    User.find()
        .select("-password")
        .then(users => {
            res.send({ users });
        })
        .catch(err => {
            console.log(err);
        })
})

app.patch('/editUser', (req, res) => {
    User.findByIdAndUpdate(req.body.id, {
        userName: req.body.userName, role: req.body.role
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

app.post("/getUserDetail", (req, res) => {
    User.findOne({ email: req.body.email })
        .select("-password")
        .then(users => {
            if (!users) {
                return res.status(400).json({ error: "No such user is present with that emailID" });
            }
            res.send(users);
        })
        .catch(err => {
            console.log(err);
        })
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: "Please add email and password" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
            bcryptjs.compare(password, savedUser.password)
                .then((domatch) => {
                    if (domatch) {
                        const { _id, userName, email, role } = savedUser
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        res.json({ token, user: { _id, userName, email, role } });
                    }
                    else {
                        return res.status(400).json({ error: "Invalid email or password" });
                    }
                })
                .catch((error) => { console.log(error) })
        })
})

app.post("/createTest", (req, res) => {
    const { domain, language, position, positionForUser, file, postedById, fileName } = req.body;
    if (!domain || !language || !file || !fileName) {
        return res.json({ error: "Please add required field" });
    }
    if (!postedById) {
        return res.json({ error: "Who creating test is needed:postedById is needed" });
    }

    const zipFile = {
        fileBase64: file,
        postedBy: postedById
    }
    let positionForUserArray = [];
    if (positionForUser.length > 0) {
        positionForUser.map((item) => {
            positionForUserArray.push(item);
        })
    }

    const post = new Test({
        domain,
        language,
        position,
        postedBy: postedById,
        positionForUser: positionForUserArray,
        file: zipFile,
        fileName
    })
    post.save().then(result => {
        res.json({ test: result })
    })
        .catch(err => {
            console.log("err while create test", err);
        })
})

app.post("/allTest", (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ error: "Please provide loginIn User Id" });
    }
    Test.find({
        $or: [{
            postedBy: id
        },
        {
            "positionForUser.postedfor": id
        }]
    })
        .then(tests => {
            res.send({ tests });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: err })
        })
})

app.post("/meeting/new", async (req, res) => {
    if (_.isEmpty(req.body)) {
        res.status(500).send({
            error: 500,
            message: "Invalid request body!",
        });
    }
    else if (!req.body.start_time) {
        res.status(500).send({
            error: 500,
            message: "Must provide a valid meeting start datetime (timestamp)!",
        });
    }
    else if (!req.body.recurrence.end_date_time) {
        res.status(500).send({
            error: 500,
            message: "Must provide a valid meeting end datetime (timestamp)!",
        });
    }
    else if (!req.body.emails) {
        res.status(500).send({
            error: 500,
            message: "Must provide emails for which meeting to be scheduled."
        });
    }
    else {
        try {

            const _res = await createNewMeeting(req.body);

            res.status(200).send(_res);
        } catch (err) {
            res.status(500).send({
                error: 500,
                message: err.toString(),
            });
        }
    }
});



app.listen(3000, () => {
    console.log("server is running on port = ", PORT);
})

// mongodb+srv://sachinpatle:<sachinit15017>@cluster0.uqohn5a.mongodb.net/?retryWrites=true&w=majority
const express = require('express');
const router   = express.Router();
const mongoose =    require('mongoose');

const User  = mongoose.model('UserModel');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ererjjfdkfndfdkfjdfsaadofk";
const _ = require("underscore");

const { createNewMeeting } = require('../meetings_model');

router.get('/getUser', (req, res) => {
    res.json(userData);
})

router.post('/createUser', (req, res) => {
    const { userName, email, password, role } = req.body;
    if (!userName || !email || !password || !role) {
        return res.status(422).json({ error: "Please add all the fields" });
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

router.delete('/deleteUser', (req, res) => {
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

router.get("/allUser", (req, res) => {
    User.find()
        .select("-password")
        .then(users => {
            res.send({ users });
        })
        .catch(err => {
            console.log(err);
        })
})

router.patch('/editUser', (req, res) => {
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

router.post("/getUserDetail", (req, res) => {
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

router.post("/login", (req, res) => {
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

router.post("/meeting/new", async (req, res) => {
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


module.exports = router

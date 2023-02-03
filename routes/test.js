const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const fs = require('fs');
const { result } = require('underscore');
const { debug } = require('console');

const Test = mongoose.model('TestModel')
const User = mongoose.model('UserModel')


router.patch("/assingTestToUser", async (req, res) => {
    try {
        let returnData = [];
        const { userId, testIds } = req.body;
        userId.map((item, index) => {
            User.findByIdAndUpdate(item, {
                $push: { tests: testIds }
            }, {
                new: true
            }).exec((err, result) => {
                if (err) {
                    console.log("error", err);
                    return res.statusCode(422).json({ error: err })
                }
                else {
                    returnData.push(result);
                    if (userId.length === returnData.length) {
                        res.json(returnData)
                    }
                }
            })
        })
    } catch (error) {
        console.log("error while assigning test", error);
        res.send(error);
    }
})

router.post("/getTestByUserId", async (req, res) => {
    try {
        let allAssignedTests = [];
        const { userId } = req.body;
        if (!userId) {
            return res.json({ error: "Please provide loginIn , User Id" });
        }
        const userData = await User.find({ _id: userId }).populate("tests.testId", "filePath _id");
        let userTests = JSON.parse(JSON.stringify(userData));
        console.log("userTests", userTests);
        if (userTests.length > 0) {
            if ("tests" in userTests[0]) {
                for (const test of userTests[0]?.tests) {
                    const fileData = fs.readFileSync(test.testId.filePath, 'base64');
                    if (!fileData) {
                        throw new Error(`File not found: ${test.testId.filePath}`);
                    } else {
                        allAssignedTests.push({ fileData: fileData, startDate: test.startDate, endDate: test.endDate });
                    }
                }
            }
        }
        res.send(allAssignedTests);
    } catch (error) {
        console.log("error", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(error.message);
        return;
    }
})



router.post("/allTest", async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.json({ error: "Please provide loginIn User Id" });
        }
        const tests = await Test.find({ postedBy: id });
        const testData = [];
        for (const test of tests) {
            const data = fs.readFileSync(test.filePath, 'base64');
            if (!data) {
                throw new Error(`File not found: ${test.filePath}`);
            }
            testData.push({ test: test, testFile: data });
        }
        res.send(testData);
    } catch (error) {
        console.log("error", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(error.message);
        return;
    }
}
)

router.post("/createTest", (req, res) => {
    const { domain, language, position, file, postedById, fileName } = req.body;
    if (!domain || !language || !file || !fileName) {
        return res.json({ error: "Please add required field" });
    }
    if (!postedById) {
        return res.json({ error: "Who creating the test is needed:postedById is needed" });
    }

    const timestamp = Date.now();

    const [type, data] = file.split(';base64,');

    const path = 'testzips/' + `${timestamp}${fileName}`;

    fs.writeFileSync(path, data, 'base64');

    const post = new Test({
        domain,
        language,
        position,
        postedBy: postedById,
        filePath: path,
        fileName
    })
    post.save().then(result => {
        res.json({ test: result })
    }).catch(err => {
        console.log("err while create test", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(err.message);
        return;
    })
})

// router.post("/getTestByUserId", async (req, res) => {
//     try {
//         const { userId, roleId } = req.body;
//         if (!userId) {
//             return res.json({ error: "Please provide loginIn User Id" });
//         }
//         const userData = await User.find({ _id: userId });
//         const assignTest = userData[0]?.tests;
//         const testFile = [];
//         if (assignTest) {
//                 assignTest.map((eachTest) => {
//                     let testData = Test.findOne({ _id: eachTest.testId });
//                     return testData;
//                 })
//             );

//                 let testStructure = {
//                     filePath: item.filePath,
//                     startDate: assignTest[index].startDate,
//                     endDate: assignTest[index].endDate,
//                 }
//                 return testStructure;
//             })

//                 for (const test of startEndDateAdded) {
//                     const fileData = fs.readFileSync(test.filePath, 'base64');
//                     testFile.push({ fileData: fileData, startDate: test.startDate, endDate: test.endDate });
//                 }
//             }
//         }
//         res.send(testFile);
//     } catch (error) {
//         console.log("error", error);
//         res.sendStatus(400).json({ error });
//     }
// })

module.exports = router;
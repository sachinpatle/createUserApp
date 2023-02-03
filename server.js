const express = require('express');
const bodyParser = require('body-parser');


const app = express();


require('./connection/connection');
require('./models/user');
require('./models/test');

// const requireLogin = require('./middleware/loginRequired');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());


const cors = require('cors');
app.use(cors());
app.use(require('./routes/test'));
app.use(require('./routes/user'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
    console.log("server is running on port = ", PORT);
})

// mongodb+srv://sachinpatle:<sachinit15017>@cluster0.uqohn5a.mongodb.net/?retryWrites=true&w=majority
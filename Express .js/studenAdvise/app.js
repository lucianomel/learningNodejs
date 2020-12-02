// app.js

const path = require('path');
const express = require('express');
// const bodyParser = require('body-parser');

const app = express();

// const mainRoute = require("./routes/main");
const usersRoute = require("./routes/users");

app.use('/users', usersRoute); 
// app.use(mainRoute);

app.listen(3000,()=>{console.log("sv started")});
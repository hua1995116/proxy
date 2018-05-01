const proxy = require('./proxy');
const express = require('express');
const app = express();

const apiProxy = proxy({target: 'http://127.0.0.1:8081'})

app.use('/', apiProxy);

app.listen(8080)

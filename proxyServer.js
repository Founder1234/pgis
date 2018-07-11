'use strict';

const express = require('express');
const router = require('./router');

const app = express();

app.use(express.static('examples'));
app.use(express.static('debug'));
app.use('/images', express.static('images'));

app.use('/proxy', router);

app.listen(7878, function() {
    console.log("proxy server is on");
});

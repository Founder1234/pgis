'use strict';

const express = require('express');
const request = require('superagent');
const router = express.Router();

router.use(function(req, res, next) {
    const url = req.query.toUrl;
    const durl = decodeURIComponent(url);

    console.log(durl);

    let text;

    request
        .get(durl)
        .set('Content-Type', 'text/json')
        .end(function(err, response) {
            debugger;
            if (err || !response.ok) {
                res.status(500).send('目标服务器错误');
            } else {
                res.charset = "UTF-8";
                res.end(response.text);
            }
        });
});

module.exports = router;

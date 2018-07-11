var express = require('express');
var open = require('open');

var app = express();

app.use(express.static(__dirname));

app.listen(8099, function() {
    console.log('EzServerClientV7.1 Serve on 8099');
    open('http://localhost:8099/index.html');
});

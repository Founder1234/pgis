var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var mime = require('./server/mime').types;

var server = http.createServer(function(request,response){
	var pathname = url.parse(request.url).pathname;
    pathname = pathname.substr(1);

    console.log(pathname);
	fs.exists(pathname,function(exists){
		if(!exists){
			response.writeHead(404, {"Content-Type": 'text/plain'});
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
		}
		else{
			fs.readFile(pathname, "binary", function(err, file){
				if (err) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end(err);
                }
                else {
                	var ext = path.extname(pathname);
                	ext = ext ? ext.slice(1) : 'unknown';
                	var contentType = mime[ext] || "text/plain";

                    response.writeHead(200, {'Content-Type': contentType});
                    response.write(file, "binary");
                    response.end();
                }
			});
		}
	});
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
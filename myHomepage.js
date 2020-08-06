var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring')

var app = http.createServer(function (request, response) {
    // var urlFromRequest = request.url;
    var queryData = url.parse(request.url, true).query;
    var pathname = url.parse(request.url, true).pathname;
    var queryDataItem = queryData.item;

    if (pathname === '/') {
        if (queryDataItem === undefined) {
            fs.readdir('./item', function (err, filelist) {
                var title = 'Lee\'s Home';
                var list = '<ul>';
                filelist.forEach(function (element) {
                    list += `<li><a href="/?item=${element}">${element}</a></li>`
                });
                list += '</ul>';
                var description = 'Welcome, noble one. This is a shabby place.';

                var htmlTemplate = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${title}</title>
                    </head>
                    <body>
                        <h1>Lee's Home</h1>
                        ${list}

                        <p>
                            <br>
                            <h2>${description}</h2>
                        </p>
                    </body>
                </html>
                `;

                response.writeHead(200);
                response.end(htmlTemplate);
            })
        } else if (queryDataItem === 'Algorithm') {
            fs.readdir('./item', function (err, filelist) {
                var title = 'Lee\'s Home - Algorithm';
                var list = '<ul>';
                filelist.forEach(function (element) {
                    list += `<li><a href="/?item=${element}">${element}</a></li>`
                });
                list += '</ul>';
                var description = 'Assigned Problems.';
                var body = '';
                var post = qs.parse(body);

                response.writeHead(200, {'Content-Type':'text/html'});
                fs.readFile('algorithm.html', function (err, data) {
                    if(err){
                        return console.error(err);
                    }
                    response.end(data, 'utf-8');
                })
            })
        } else {
            // AI, Applied Software etc...
            response.writeHead(200);
            response.end('Preparing...');
        }
    } else if (pathname === '/submit') {
        response.writeHead(200);
        response.end('Preparing...');
    } else if (pathname === '/submit-process') {
        response.writeHead(200);
        response.end('Preparing...');
    } else if (pathname === '/algorithm-list') {
        response.writeHead(200);
        response.end('Preparing...');
    } else {
        response.writeHead(404);
        response.end('Not Found. Ooops');
    }
});

app.listen(7100);
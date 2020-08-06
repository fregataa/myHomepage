var http = require('http');
var fs = require('fs');
var urlM = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');

var app = http.createServer(function (request, response) {
    var url = request.url;
    var queryData = urlM.parse(url, true).query;
    var pathname = urlM.parse(url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {

            fs.readdir('./testData', function (err, filelist) {

                var title = 'Welcome!';
                var description = 'Hello, Node js!';

                var list = template.list(filelist);

                var html = template.html(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            })

        } else {
            fs.readdir('./testData', function (err, filelist) {
                var list = template.list(filelist);
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`testData/${filteredId}`, 'utf8', function (err, description) {
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description);
                    var html = template.html(title, list,
                        `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        `
                        <a href="/create">create</a> 
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="delete-process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                        </form>
                        `);
                    response.writeHead(200);
                    response.end(html);
                })
            })
        }
    } else if(pathname === '/create') {
        fs.readdir('./testData', function (err, filelist) {

            var title = 'WEB - create';
            var list = template.list(filelist);

            var html = template.html(title, list,
                `
                <form action="/create-process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `, '');
            response.writeHead(200);
            response.end(html);
        })
    } else if(pathname === '/create-process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`testData/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            })
        });

    } else if(pathname === '/update'){
        fs.readdir('./testData', function (err, filelist) {
            var list = template.list(filelist);
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`testData/${filteredId}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var html = template.html(title, list,
                    `
                    <form action="/update-process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            })
        })
    } else if(pathname === '/update-process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            var filteredId = path.parse(id).base;
            fs.rename(`./testData/${filteredId}`,`./testData/${title}`, function(error){
                fs.writeFile(`testData/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });

        });

    } else if(pathname === '/delete-process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`.testData/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });

    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

app.listen(3000);
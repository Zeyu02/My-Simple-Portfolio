const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8000;
const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.mp4': 'video/mp4',
    '.json': 'application/json; charset=utf-8'
};

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8') {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(body);
}

function resolvePath(requestUrl) {
    const url = new URL(requestUrl, `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.normalize(path.join(root, pathname));

    if (filePath !== root && !filePath.startsWith(root + path.sep)) {
        return null;
    }

    return filePath;
}

http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        send(res, 405, 'Method Not Allowed');
        return;
    }

    const filePath = resolvePath(req.url);

    if (!filePath) {
        send(res, 403, 'Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'EISDIR') {
                fs.readFile(path.join(filePath, 'index.html'), (dirErr, dirData) => {
                    if (dirErr) {
                        send(res, 404, 'Not Found');
                        return;
                    }

                    res.writeHead(200, {
                        'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
                        'Cache-Control': 'no-store'
                    });

                    if (req.method === 'HEAD') {
                        res.end();
                        return;
                    }

                    res.end(dirData);
                });
                return;
            }

            send(res, 404, 'Not Found');
            return;
        }

        res.writeHead(200, {
            'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });

        if (req.method === 'HEAD') {
            res.end();
            return;
        }

        res.end(data);
    });
}).listen(port, () => {
    console.log(`Dev server running at http://127.0.0.1:${port}`);
});

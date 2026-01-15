const http = require('http');
const EventEmitter = require('events');

module.exports = class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer();
        this.middlewares = [];
        this.routes = {}; 
    }

    addRoute(method, path, handler) {
        if (!this.routes[path]) this.routes[path] = {};
        this.routes[path][method] = handler;
    }

    get(path, handler) { this.addRoute('GET', path, handler); }
    post(path, handler) { this.addRoute('POST', path, handler); }
    put(path, handler) { this.addRoute('PUT', path, handler); }
    patch(path, handler) { this.addRoute('PATCH', path, handler); }
    delete(path, handler) { this.addRoute('DELETE', path, handler); }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = "";
            
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                if (body) {
                    try {
                        req.body = JSON.parse(body);
                    } catch (e) {
                        req.body = {};
                    }
                } else {
                    req.body = {};
                }

                res.send = (data) => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                };
                
                res.json = (data) => {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(data));
                };

                res.status = (code) => {
                    res.statusCode = code;
                    return res;
                };

                const reqUrl = new URL(req.url, `http://${req.headers.host}`);
                req.query = Object.fromEntries(reqUrl.searchParams);
                
                let matchedPath = null;
                let params = {};

                const registeredPaths = Object.keys(this.routes);
                
                for (let routePath of registeredPaths) {
                    if (routePath.includes(':id')) {
                        const regexPath = routePath.replace(':id', '([^/]+)');
                        const match = reqUrl.pathname.match(new RegExp(`^${regexPath}$`));
                        if (match) {
                            matchedPath = routePath;
                            params.id = match[1];
                            break;
                        }
                    } else if (routePath === reqUrl.pathname) {
                        matchedPath = routePath;
                        break;
                    }
                }

                req.params = params;

                if (matchedPath && this.routes[matchedPath][req.method]) {
                    try {
                        this.routes[matchedPath][req.method](req, res);
                    } catch (err) {
                        res.status(500).json({ error: "Internal Server Error" });
                    }
                } else {
                    res.status(404).json({ error: `Cannot ${req.method} ${reqUrl.pathname}` });
                }
            });
        });
    }
};
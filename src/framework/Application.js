const http = require('http');
const EventEmitter = require('events');
const bodyParser = require('./bodyParser');
const urlParser = require('./parseUrl');

class Application {
    constructor() {
        this.emitter = new EventEmitter();
        this.server = this._createServer();
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    addRouter(method, path, handler) {
        this.emitter.on(this._getRouteMask(path, method), (req, res) => {
            handler(req, res);
        });
    }

    get(path, handler) { this.addRouter('GET', path, handler); }
    post(path, handler) { this.addRouter('POST', path, handler); }
    put(path, handler) { this.addRouter('PUT', path, handler); }
    patch(path, handler) { this.addRouter('PATCH', path, handler); }
    delete(path, handler) { this.addRouter('DELETE', path, handler); }

    _createServer() {
        return http.createServer((req, res) => {
            const baseUrl = 'http://' + req.headers.host + '/';
            urlParser(baseUrl)(req, res);

            res.send = (data) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            };
            res.json = (data) => res.send(data);
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };

            bodyParser(req, res).then(() => {
                const emitted = this.emitter.eventNames().some(eventName => {
                    const [method, routePath] = eventName.split(':');
                    if (method !== req.method) return false;

                    const routeParts = routePath.split('/');
                    const reqParts = req.pathname.split('/');

                    if (routeParts.length !== reqParts.length) return false;

                    const params = {};
                    const match = routeParts.every((part, i) => {
                        if (part.startsWith(':')) {
                            params[part.slice(1)] = reqParts[i];
                            return true;
                        }
                        return part === reqParts[i];
                    });

                    if (match) {
                        req.params = params;
                        this.emitter.emit(eventName, req, res);
                        return true;
                    }
                    return false;
                });

                if (!emitted) {
                    res.status(404).end('Not Found');
                }
            });
        });
    }

    _getRouteMask(path, method) {
        return `${method}:${path}`;
    }
}

module.exports = Application;
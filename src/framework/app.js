import http from 'http';
import EventEmitter from 'events';

// Если вы используете отдельный Router, раскомментируйте следующую строку:
// import { Router } from './router.js'; 

export default class Application {
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

    addRouter(router) {
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach(method => {
                this.emitter.on(this._getRouteMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res);
                });
            });
        });
    }

    _createServer() {
        return http.createServer((req, res) => {
            let body = "";
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                if(body) {
                    try { req.body = JSON.parse(body); } catch(e) { req.body = {}; }
                } else { req.body = {}; }

                // Добавляем методы для удобства
                res.json = (data) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                };
                res.status = (code) => { res.statusCode = code; return res; };

                // Эмитим событие маршрута
                const emitted = this.emitter.emit(this._getRouteMask(req.url, req.method), req, res);
                if (!emitted) {
                    // Простая проверка точного совпадения не сработала, пробуем найти роуты
                    // (здесь упрощенная логика, если у вас сложный Application.js из прошлого шага - используйте его!)
                    res.status(404).json({error: "Not found"});
                }
            });
        });
    }

    _getRouteMask(path, method) {
        return `[${path}]:[${method}]`;
    }
}
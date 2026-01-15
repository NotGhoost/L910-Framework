const http = require('http');
const Router = require('./router');
const bodyParser = require('./bodyParser');
const errorHandler = require('./errorHandler');

class App {
  constructor() {
    this.server = http.createServer(this.handle.bind(this));
    this.router = new Router();
    this.middlewares = [bodyParser];
  }

  use(mw) {
    this.middlewares.push(mw);
  }

  handle(req, res) {
    res.send = (data) => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    };

    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    let i = 0;
    const next = () => {
      if (i < this.middlewares.length) {
        this.middlewares[i++](req, res, next);
      } else {
        this.router.handle(req, res);
      }
    };

    try {
      next();
    } catch (e) {
      errorHandler(e, req, res);
    }
  }

  listen(port, cb) {
    this.server.listen(port, cb);
  }

  get(path, h) { this.router.register('GET', path, h); }
  post(path, h) { this.router.register('POST', path, h); }
  put(path, h) { this.router.register('PUT', path, h); }
  patch(path, h) { this.router.register('PATCH', path, h); }
  delete(path, h) { this.router.register('DELETE', path, h); }
}

module.exports = App;

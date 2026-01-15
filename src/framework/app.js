import http from 'http';
import { Router } from './router.js';
import { enhanceRequest } from './request.js';
import { enhanceResponse } from './response.js';

export class App {
  constructor() {
    this.router = new Router();
  }

  use(mw) { this.router.use(mw); }

  get(path, ...fns) { this.router.get(path, ...fns); }
  post(path, ...fns) { this.router.post(path, ...fns); }
  put(path, ...fns) { this.router.put(path, ...fns); }
  patch(path, ...fns) { this.router.patch(path, ...fns); }
  delete(path, ...fns) { this.router.delete(path, ...fns); }

  setErrorHandler(fn) { this.router.setErrorHandler(fn); }

  listen(port, handler) {
    const server = http.createServer(async (req, res) => {
      await enhanceRequest(req);
      enhanceResponse(res);
      this.router.handle(req, res);
    });
    return server.listen(port, handler);
  }
}

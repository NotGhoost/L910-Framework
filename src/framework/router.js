import { HttpError } from './errors.js';

function pathToRegex(path) {
  const keys = [];
  const pattern = path
    .replace(/\/+$/, '')
    .replace(/\/:(\w+)/g, (_, key) => { keys.push(key); return '/([^/]+)'; });
  const regex = new RegExp(`^${pattern || ''}/?$`);
  return { regex, keys };
}

export class Router {
  constructor() {
    this.routes = [];
    this.middlewares = [];
    this.errorHandler = (err, req, res) => {
      const status = err?.status || 500;
      res.status(status).json({ error: err?.message || 'Internal Server Error' });
    };
  }

  use(mw) { this.middlewares.push(mw); }

  on(method, path, ...fns) {
    const handler = fns.pop();
    const mw = fns;
    const { regex, keys } = pathToRegex(path);
    this.routes.push({ method: method.toUpperCase(), path, handler, keys, regex, middlewares: mw });
  }

  get(path, ...fns) { this.on('GET', path, ...fns); }
  post(path, ...fns) { this.on('POST', path, ...fns); }
  put(path, ...fns) { this.on('PUT', path, ...fns); }
  patch(path, ...fns) { this.on('PATCH', path, ...fns); }
  delete(path, ...fns) { this.on('DELETE', path, ...fns); }

  setErrorHandler(fn) { this.errorHandler = fn; }

  async handle(req, res) {
    const route = this.routes.find(r => r.method === req.method && r.regex.test(req.path));
    const stack = [];
    stack.push(...this.middlewares);

    if (route) {
      const match = req.path.match(route.regex);
      if (match) {
        route.keys.forEach((k, i) => { req.params[k] = decodeURIComponent(match[i + 1]); });
      }
      stack.push(...route.middlewares);
      stack.push(async (req, res) => { await route.handler(req, res); });
    } else {
      stack.push(() => { throw new HttpError(404, 'Not Found'); });
    }

    let idx = -1;
    const next = async () => {
      idx++;
      const fn = stack[idx];
      if (!fn) return;
      await fn(req, res, next);
    };

    try { await next(); }
    catch (err) { this.errorHandler(err, req, res); }
  }
}

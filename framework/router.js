const url = require('url');

class Router {
  constructor() {
    this.routes = [];
  }

  register(method, path, handler) {
    const parts = path.split('/').filter(Boolean);
    this.routes.push({ method, parts, handler });
  }

  handle(req, res) {
    const { pathname, query } = url.parse(req.url, true);
    req.query = query;

    const parts = pathname.split('/').filter(Boolean);

    for (const r of this.routes) {
      if (r.method !== req.method) continue;
      if (r.parts.length !== parts.length) continue;

      let params = {};
      let match = true;

      r.parts.forEach((p, i) => {
        if (p.startsWith(':')) {
          params[p.slice(1)] = parts[i];
        } else if (p !== parts[i]) {
          match = false;
        }
      });

      if (match) {
        req.params = params;
        return r.handler(req, res);
      }
    }

    res.status(404).send('Not Found');
  }
}

module.exports = Router;

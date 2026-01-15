import { URL } from 'url';

export async function enhanceRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  req.query = Object.fromEntries(url.searchParams.entries());
  req.params = {};
  req.path = url.pathname;
  req.body = await parseBody(req);
  return req;
}

function parseBody(req) {
  const method = req.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve(null);
      try {
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          resolve(JSON.parse(raw));
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(raw);
          resolve(Object.fromEntries(params.entries()));
        } else {
          resolve(raw);
        }
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

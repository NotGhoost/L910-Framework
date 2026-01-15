export function enhanceResponse(res) {
  res.statusCode = 200;
  res.status = function (code) { this.statusCode = code; return this; };
  res.send = function (data) {
    if (data === undefined || data === null) data = '';
    if (typeof data === 'object') {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.end(JSON.stringify(data));
    } else {
      this.setHeader('Content-Type', 'text/plain; charset=utf-8');
      this.end(String(data));
    }
  };
  res.json = function (obj) {
    this.setHeader('Content-Type', 'application/json; charset=utf-8');
    this.end(JSON.stringify(obj));
  };
  return res;
}

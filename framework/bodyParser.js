module.exports = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        req.body = data ? JSON.parse(data) : {};
        next();
      } catch {
        res.status(400).send('Invalid JSON');
      }
    });
  } else {
    next();
  }
};

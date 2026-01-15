import { App } from './framework/app.js';
import { registerTheatreRoutes } from './routes/theatre.routes.js';
import { HttpError } from './framework/errors.js';

const app = new App();

app.use(async (req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  await next();
});

app.use(async (req, res, next) => {
  const m = req.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH'].includes(m)) {
    const ct = req.headers['content-type'] || '';
    if (req.body && typeof req.body === 'string' && ct.includes('application/json')) {
      throw new HttpError(400, 'Invalid JSON');
    }
  }
  await next();
});

registerTheatreRoutes(app);

app.setErrorHandler((err, req, res) => {
  const status = err?.status || 500;
  res.status(status).json({
    error: err?.message || 'Internal Server Error',
    path: req.path
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Theatre server is listening on port ${PORT}`);
});

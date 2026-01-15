const fs = require('fs');
const App = require('./framework/app');
const app = new App();

const read = (f) => JSON.parse(fs.readFileSync(f));
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

/* Philosophers */
app.get('/philosophers', (req, res) =>
  res.json(read('./data/philosophers.json'))
);

app.get('/philosophers/:id', (req, res) => {
  const data = read('./data/philosophers.json');
  res.json(data.find(p => p.id == req.params.id));
});

app.post('/philosophers', (req, res) => {
  const data = read('./data/philosophers.json');
  const obj = { id: Date.now(), ...req.body };
  data.push(obj);
  write('./data/philosophers.json', data);
  res.status(201).json(obj);
});

app.put('/philosophers/:id', (req, res) => {
  let data = read('./data/philosophers.json');
  data = data.map(p => p.id == req.params.id ? req.body : p);
  write('./data/philosophers.json', data);
  res.json(req.body);
});

app.patch('/philosophers/:id', (req, res) => {
  const data = read('./data/philosophers.json');
  const p = data.find(p => p.id == req.params.id);
  Object.assign(p, req.body);
  write('./data/philosophers.json', data);
  res.json(p);
});

/* Concepts — аналогично */
app.get('/concepts', (req, res) =>
  res.json(read('./data/concepts.json'))
);

app.listen(3000, () => console.log('Server started'));

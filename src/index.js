const Application = require('./framework/Application');
const { readDb, writeDb } = require('./database/db');
const crypto = require('crypto'); // Встроенный модуль для генерации ID

const PORT = 5000;
const app = new Application();

// --- СУЩНОСТЬ 1: WORKERS (Рабочие) ---
// Поля: fullName (string), salary (number), isOnShift (boolean), hireDate (date string), skills (array)

// GET - получить всех
app.get('/workers', (req, res) => {
    const workers = readDb('workers.json');
    res.send(workers);
});

// GET by ID - получить одного
app.get('/workers/:id', (req, res) => {
    const workers = readDb('workers.json');
    const worker = workers.find(w => w.id === req.params.id);
    if (worker) res.send(worker);
    else res.status(404).send({ error: 'Worker not found' });
});

// POST - создать нового
app.post('/workers', (req, res) => {
    const workers = readDb('workers.json');
    const newWorker = {
        id: crypto.randomUUID(),
        fullName: req.body.fullName || "Unknown Worker",
        salary: req.body.salary || 0,
        isOnShift: req.body.isOnShift || false,
        hireDate: new Date().toISOString(),
        skills: req.body.skills || []
    };
    workers.push(newWorker);
    writeDb('workers.json', workers);
    res.send(newWorker);
});

app.put('/workers/:id', (req, res) => {
    let workers = readDb('workers.json');
    const index = workers.findIndex(w => w.id === req.params.id);
    
    if (index !== -1) {
        workers[index] = {
            ...workers[index],
            ...req.body,
            id: workers[index].id 
        };
        writeDb('workers.json', workers);
        res.send(workers[index]);
    } else {
        res.status(404).send({ error: 'Worker not found' });
    }
});

app.delete('/workers/:id', (req, res) => {
    let workers = readDb('workers.json');
    const newWorkers = workers.filter(w => w.id !== req.params.id);
    
    if (newWorkers.length !== workers.length) {
        writeDb('workers.json', newWorkers);
        res.send({ message: 'Worker deleted' });
    } else {
        res.status(404).send({ message: 'Worker not found' });
    }
});

app.get('/products', (req, res) => {
    const products = readDb('products.json');
    res.send(products);
});

app.get('/products/:id', (req, res) => {
    const products = readDb('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (product) res.send(product);
    else res.status(404).send({ error: 'Product not found' });
});

app.post('/products', (req, res) => {
    const products = readDb('products.json');
    const newProduct = {
        id: crypto.randomUUID(),
        modelName: req.body.modelName || "Standard Model",
        weightKg: req.body.weightKg || 0,
        passedQC: typeof req.body.passedQC === 'boolean' ? req.body.passedQC : false,
        manufacturedAt: new Date().toISOString(),
        components: req.body.components || []
    };
    products.push(newProduct);
    writeDb('products.json', products);
    res.send(newProduct);
});
app.patch('/products/:id', (req, res) => {
    let products = readDb('products.json');
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
        products[index] = updatedProduct;
        writeDb('products.json', products);
        res.send(updatedProduct);
    } else {
        res.status(404).send({ error: 'Product not found' });
    }
});
app.delete('/products/:id', (req, res) => {
    let products = readDb('products.json');
    const newProducts = products.filter(p => p.id !== req.params.id);
    
    if (newProducts.length !== products.length) {
        writeDb('products.json', newProducts);
        res.send({ message: 'Product deleted' });
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
});
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
    console.log(`Entities available: Workers and Products (Factory Theme)`);
});
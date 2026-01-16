import Application from './framework/Application.js';
import crypto from 'crypto';
import fs from 'fs'; // Нужен для чтения файлов философии, если утилиты их не видят
import { readData, writeData } from './utils/fileSync.js';
import { readDb, writeDb } from './database/db.js';

// --- НАСТРОЙКИ ---
const PORT = 5000; 
const app = new Application();

// Вспомогательные функции для философии (чтобы сохранить их пути к папке ./data/)
// Если ваши readData/readDb могут читать из любой папки, можно заменить на них
const readPhil = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));
const writePhil = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// ==========================
// ЧАСТЬ 1: КИНОТЕАТР (из 1-го кода)
// ==========================

app.get('/movies', (req, res) => {
    const movies = readData('movies.json');
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const movies = readData('movies.json');
    const movie = movies.find(m => m.id === req.params.id);
    if (movie) res.json(movie);
    else res.status(404).json({ message: "Movie not found" });
});

app.post('/movies', (req, res) => {
    const movies = readData('movies.json');
    const newMovie = {
        id: crypto.randomUUID(),
        title: req.body.title || "Untitled",
        duration: req.body.duration || 0,
        is3D: req.body.is3D || false,
        releaseDate: req.body.releaseDate || new Date().toISOString(),
        genres: req.body.genres || []
    };
    movies.push(newMovie);
    writeData('movies.json', movies);
    res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
    const movies = readData('movies.json');
    const index = movies.findIndex(m => m.id === req.params.id);
    if (index !== -1) {
        movies[index] = { ...movies[index], ...req.body, id: req.params.id };
        writeData('movies.json', movies);
        res.json(movies[index]);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

app.delete('/movies/:id', (req, res) => {
    let movies = readData('movies.json');
    const initialLength = movies.length;
    movies = movies.filter(m => m.id !== req.params.id);
    if (movies.length !== initialLength) {
        writeData('movies.json', movies);
        res.status(200).json({ message: "Movie deleted" });
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

app.get('/sessions', (req, res) => {
    const sessions = readData('sessions.json');
    res.json(sessions);
});

app.post('/sessions', (req, res) => {
    const sessions = readData('sessions.json');
    const newSession = {
        id: crypto.randomUUID(),
        movieId: req.body.movieId,
        hallName: req.body.hallName || "Default Hall",
        price: req.body.price || 0,
        isVip: req.body.isVip || false,
        showTime: req.body.showTime || new Date().toISOString()
    };
    sessions.push(newSession);
    writeData('sessions.json', sessions);
    res.status(201).json(newSession);
});

// ==========================
// ЧАСТЬ 2: ЗАВОД (из 1-го кода)
// ==========================

app.get('/workers', (req, res) => {
    const workers = readDb('workers.json');
    res.json(workers);
});

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
    res.json(newWorker);
});

app.get('/products', (req, res) => {
    const products = readDb('products.json');
    res.json(products);
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
    res.json(newProduct);
});

// ==========================
// ЧАСТЬ 3: ФИЛОСОФИЯ (адаптация 2-го кода под стиль 1-го)
// ==========================

app.get('/philosophers', (req, res) => {
    res.json(readPhil('./data/philosophers.json'));
});

app.get('/philosophers/:id', (req, res) => {
    const data = readPhil('./data/philosophers.json');
    const philosopher = data.find(p => p.id == req.params.id);
    if (philosopher) res.json(philosopher);
    else res.status(404).json({ message: "Philosopher not found" });
});

app.post('/philosophers', (req, res) => {
    const data = readPhil('./data/philosophers.json');
    // Используем crypto.randomUUID() для согласованности с остальным кодом
    const obj = { id: crypto.randomUUID(), ...req.body };
    data.push(obj);
    writePhil('./data/philosophers.json', data);
    res.status(201).json(obj);
});

app.put('/philosophers/:id', (req, res) => {
    let data = readPhil('./data/philosophers.json');
    const index = data.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        data[index] = { ...req.body, id: req.params.id };
        writePhil('./data/philosophers.json', data);
        res.json(data[index]);
    } else {
        res.status(404).json({ message: "Philosopher not found" });
    }
});

app.patch('/philosophers/:id', (req, res) => {
    const data = readPhil('./data/philosophers.json');
    const p = data.find(p => p.id == req.params.id);
    if (p) {
        Object.assign(p, req.body);
        writePhil('./data/philosophers.json', data);
        res.json(p);
    } else {
        res.status(404).json({ message: "Philosopher not found" });
    }
});

app.get('/concepts', (req, res) => {
    res.json(readPhil('./data/concepts.json'));
});

// ==========================
// ЗАПУСК
// ==========================

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`Кинотеатр: http://localhost:${PORT}/movies`);
    console.log(`Завод: http://localhost:${PORT}/workers`);
    console.log(`Философия: http://localhost:${PORT}/philosophers`);
});
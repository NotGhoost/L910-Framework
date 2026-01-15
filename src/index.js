import Application from './framework/Application.js';
import crypto from 'crypto';

// ВАЖНО: Убедитесь, что файлы в папках utils и database тоже используют "export", а не "module.exports"
// Если эти файлы делают одно и то же, позже лучше оставить только один из них.
import { readData, writeData } from './utils/fileSync.js'; 
import { readDb, writeDb } from './database/db.js'; 

const PORT = 5000;
const app = new Application();

// ==========================
// ЧАСТЬ 1: КИНОТЕАТР (Movies & Sessions)
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
        movies[index] = { 
            ...movies[index],
            ...req.body,
            id: req.params.id // ID не меняем
        };
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

// --- Sessions ---

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
// ЧАСТЬ 2: ЗАВОД (Workers & Products)
// ==========================

app.get('/workers', (req, res) => {
    const workers = readDb('workers.json');
    res.json(workers); // заменил send на json для единообразия
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
// ЗАПУСК СЕРВЕРА
// ==========================

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🎬 Кинотеатр: http://localhost:${PORT}/movies`);
    console.log(`🏭 Завод:     http://localhost:${PORT}/workers`);
});
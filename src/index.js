const Application = require('./framework/Application');
const { readData, writeData } = require('./utils/fileSync');
const crypto = require('crypto');

const PORT = 5000;
const app = new Application();

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
            id: req.params.id, 
            title: req.body.title,
            duration: req.body.duration,
            is3D: req.body.is3D,
            releaseDate: req.body.releaseDate,
            genres: req.body.genres
        };
        writeData('movies.json', movies);
        res.json(movies[index]);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});
app.patch('/movies/:id', (req, res) => {
    const movies = readData('movies.json');
    const index = movies.findIndex(m => m.id === req.params.id);
    
    if (index !== -1) {
        const updatedMovie = { ...movies[index], ...req.body };
        movies[index] = updatedMovie;
        writeData('movies.json', movies);
        res.json(updatedMovie);
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
app.get('/sessions/:id', (req, res) => {
    const sessions = readData('sessions.json');
    const session = sessions.find(s => s.id === req.params.id);
    if (session) res.json(session);
    else res.status(404).json({ message: "Session not found" });
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
app.put('/sessions/:id', (req, res) => {
    const sessions = readData('sessions.json');
    const index = sessions.findIndex(s => s.id === req.params.id);
    
    if (index !== -1) {
        sessions[index] = { id: req.params.id, ...req.body };
        writeData('sessions.json', sessions);
        res.json(sessions[index]);
    } else {
        res.status(404).json({ message: "Session not found" });
    }
});
app.delete('/sessions/:id', (req, res) => {
    let sessions = readData('sessions.json');
    const initialLength = sessions.length;
    sessions = sessions.filter(s => s.id !== req.params.id);
    
    if (sessions.length !== initialLength) {
        writeData('sessions.json', sessions);
        res.status(200).json({ message: "Session deleted" });
    } else {
        res.status(404).json({ message: "Session not found" });
    }
});
app.listen(PORT, () => {
    console.log(`Сервер Кинотеатра запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}/movies`);
    console.log(`http://localhost:${PORT}/sessions`);
});
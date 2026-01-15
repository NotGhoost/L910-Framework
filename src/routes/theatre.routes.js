import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HttpError } from '../framework/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

function readJson(file) {
  const p = path.join(dataDir, file);
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

function writeJson(file, obj) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8');
}

function randomId(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 8);
}

function isDateString(s) { return typeof s === 'string' && !isNaN(Date.parse(s)); }

export function registerTheatreRoutes(app) {
  app.get('/plays', (req, res) => {
    const db = readJson('plays.json');
    res.json(db.plays);
  });

  app.get('/plays/:id', (req, res) => {
    const db = readJson('plays.json');
    const item = db.plays.find(p => p.id === req.params.id);
    if (!item) throw new HttpError(404, 'Play not found');
    res.json(item);
  });

  app.post('/plays', (req, res) => {
    const db = readJson('plays.json');
    let payload = req.body;
    if (!payload || typeof payload !== 'object') {
      payload = {
        id: randomId('pl'),
        title: 'Новая пьеса ' + Math.random().toString(36).slice(2, 5),
        duration: Math.floor(Math.random() * 120) + 60,
        isPremiere: Math.random() < 0.5,
        genres: ['драма', 'комедия'].filter(() => Math.random() < 0.5),
        premiereDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      };
    } else {
      payload.id = payload.id || randomId('pl');
      if (!isDateString(payload.premiereDate)) payload.premiereDate = new Date().toISOString();
      if (!Array.isArray(payload.genres)) payload.genres = [];
      if (typeof payload.isPremiere !== 'boolean') payload.isPremiere = false;
      if (typeof payload.duration !== 'number') payload.duration = 90;
      if (typeof payload.title !== 'string') payload.title = 'Без названия';
    }
    db.plays.push(payload);
    writeJson('plays.json', db);
    res.status(201).json(payload);
  });

  app.put('/plays/:id', (req, res) => {
    const db = readJson('plays.json');
    const idx = db.plays.findIndex(p => p.id === req.params.id);
    if (idx < 0) throw new HttpError(404, 'Play not found');
    const body = req.body || {};
    if (!isDateString(body.premiereDate)) body.premiereDate = db.plays[idx].premiereDate;
    if (!Array.isArray(body.genres)) body.genres = db.plays[idx].genres;
    db.plays[idx] = {
      id: db.plays[idx].id,
      title: typeof body.title === 'string' ? body.title : db.plays[idx].title,
      duration: typeof body.duration === 'number' ? body.duration : db.plays[idx].duration,
      isPremiere: typeof body.isPremiere === 'boolean' ? body.isPremiere : db.plays[idx].isPremiere,
      genres: body.genres,
      premiereDate: body.premiereDate
    };
    writeJson('plays.json', db);
    res.json(db.plays[idx]);
  });

  app.patch('/plays/:id', (req, res) => {
    const db = readJson('plays.json');
    const item = db.plays.find(p => p.id === req.params.id);
    if (!item) throw new HttpError(404, 'Play not found');
    const body = req.body || {};
    if (typeof body.title === 'string') item.title = body.title;
    if (typeof body.duration === 'number') item.duration = body.duration;
    if (typeof body.isPremiere === 'boolean') item.isPremiere = body.isPremiere;
    if (isDateString(body.premiereDate)) item.premiereDate = body.premiereDate;
    if (Array.isArray(body.genres)) item.genres = body.genres;
    const tag = 'patched-' + Math.random().toString(36).slice(2, 6);
    item.genres = Array.isArray(item.genres) ? item.genres : [];
    item.genres.push(tag);
    writeJson('plays.json', { plays: db.plays });
    res.json(item);
  });

  app.delete('/plays/:id', (req, res) => {
    const db = readJson('plays.json');
    const idx = db.plays.findIndex(p => p.id === req.params.id);
    if (idx < 0) throw new HttpError(404, 'Play not found');
    const removed = db.plays.splice(idx, 1)[0];
    writeJson('plays.json', db);
    res.json({ deleted: removed.id });
  });

  app.get('/actors', (req, res) => {
    const db = readJson('actors.json');
    res.json(db.actors);
  });

  app.get('/actors/:id', (req, res) => {
    const db = readJson('actors.json');
    const item = db.actors.find(p => p.id === req.params.id);
    if (!item) throw new HttpError(404, 'Actor not found');
    res.json(item);
  });

  app.post('/actors', (req, res) => {
    const db = readJson('actors.json');
    let payload = req.body;
    if (!payload || typeof payload !== 'object') {
      payload = {
        id: randomId('ac'),
        name: 'Актёр ' + Math.random().toString(36).slice(2, 5),
        age: Math.floor(Math.random() * 30) + 20,
        isAvailable: Math.random() < 0.7,
        roles: ['Гамлет', 'Офелия', 'Клавдий'].filter(() => Math.random() < 0.5),
        joinedDate: new Date().toISOString().slice(0, 10)
      };
    } else {
      payload.id = payload.id || randomId('ac');
      if (!Array.isArray(payload.roles)) payload.roles = [];
      if (typeof payload.isAvailable !== 'boolean') payload.isAvailable = true;
      if (typeof payload.age !== 'number') payload.age = 25;
      if (typeof payload.name !== 'string') payload.name = 'Без имени';
      if (!isDateString(payload.joinedDate)) payload.joinedDate = new Date().toISOString().slice(0, 10);
    }
    db.actors.push(payload);
    writeJson('actors.json', db);
    res.status(201).json(payload);
  });

  app.put('/actors/:id', (req, res) => {
    const db = readJson('actors.json');
    const idx = db.actors.findIndex(p => p.id === req.params.id);
    if (idx < 0) throw new HttpError(404, 'Actor not found');
    const body = req.body || {};
    if (!Array.isArray(body.roles)) body.roles = db.actors[idx].roles;
    if (!isDateString(body.joinedDate)) body.joinedDate = db.actors[idx].joinedDate;
    db.actors[idx] = {
      id: db.actors[idx].id,
      name: typeof body.name === 'string' ? body.name : db.actors[idx].name,
      age: typeof body.age === 'number' ? body.age : db.actors[idx].age,
      isAvailable: typeof body.isAvailable === 'boolean' ? body.isAvailable : db.actors[idx].isAvailable,
      roles: body.roles,
      joinedDate: body.joinedDate
    };
    writeJson('actors.json', db);
    res.json(db.actors[idx]);
  });

  app.patch('/actors/:id', (req, res) => {
    const db = readJson('actors.json');
    const item = db.actors.find(p => p.id === req.params.id);
    if (!item) throw new HttpError(404, 'Actor not found');
    const body = req.body || {};
    if (typeof body.name === 'string') item.name = body.name;
    if (typeof body.age === 'number') item.age = body.age;
    if (Array.isArray(body.roles)) item.roles = body.roles;
    if (isDateString(body.joinedDate)) item.joinedDate = body.joinedDate;
    item.isAvailable = Math.random() < 0.5 ? true : false;
    writeJson('actors.json', { actors: db.actors });
    res.json(item);
  });

  app.delete('/actors/:id', (req, res) => {
    const db = readJson('actors.json');
    const idx = db.actors.findIndex(p => p.id === req.params.id);
    if (idx < 0) throw new HttpError(404, 'Actor not found');
    const removed = db.actors.splice(idx, 1)[0];
    writeJson('actors.json', db);
    res.json({ deleted: removed.id });
  });
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// В ES Modules нет переменной __dirname, создаем её сами:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readDb = (fileName) => {
    // Ищем файл относительно папки, где лежит db.js
    const filePath = path.resolve(__dirname, fileName);
    
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData ? JSON.parse(fileData) : [];
};

export const writeDb = (fileName, data) => {
    const filePath = path.resolve(__dirname, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
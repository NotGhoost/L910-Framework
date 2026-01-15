import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Создаем аналог __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const writeData = (filename, content) => {
    // Строим путь: текущая папка -> назад (..) -> папка database -> файл
    const filePath = path.join(__dirname, '..', 'database', filename);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
};

export const readData = (filename) => {
    try {
        const filePath = path.join(__dirname, '..', 'database', filename);
        
        // Если файла нет — создаем его с пустым массивом []
        if (!fs.existsSync(filePath)) {
            // Убедимся, что папка database вообще существует, иначе будет ошибка
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(filePath, '[]', 'utf8');
            return [];
        }
        
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Ошибка чтения файла:", err);
        return [];
    }
};
const fs = require('fs');
const path = require('path');

const writeData = (filename, content) => {
    fs.writeFileSync(path.join(__dirname, '..', 'database', filename), JSON.stringify(content, null, 2), 'utf8');
};

const readData = (filename) => {
    try {
        const filePath = path.join(__dirname, '..', 'database', filename);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf8');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

module.exports = { writeData, readData };
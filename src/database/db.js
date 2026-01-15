const fs = require('fs');
const path = require('path');

const readDb = (fileName) => {
    const filePath = path.resolve(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData ? JSON.parse(fileData) : [];
};

const writeDb = (fileName, data) => {
    const filePath = path.resolve(__dirname, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readDb, writeDb };
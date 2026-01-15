module.exports = (req, res) => {
    return new Promise((resolve, reject) => {
        let body = "";
        
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            if (body) {
                try {
                    req.body = JSON.parse(body);
                } catch (e) {
                    req.body = {};
                }
            } else {
                req.body = {};
            }
            resolve();
        });

        req.on('error', (err) => {
            console.error(err);
            reject(err);
        });
    });
};
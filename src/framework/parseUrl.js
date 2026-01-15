module.exports = (baseUrl) => (req, res) => {
    const parsedUrl = new URL(req.url, baseUrl);
    req.pathname = parsedUrl.pathname;
    
    const params = {};
    parsedUrl.searchParams.forEach((value, key) => params[key] = value);
    req.query = params;
}
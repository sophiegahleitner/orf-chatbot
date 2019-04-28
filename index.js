const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const server = express();
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => res.send('page'));
server.post('/orf-data', (req, res) => res.json({
    "speech": "das ist ein test",
    "displayText": "das ist ein test",
    "source": 'get-movie-details'
}));



server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
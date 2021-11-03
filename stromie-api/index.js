const express = require('express');
const axios = require('axios');
const app = express();
const port = 2434;

let clients = [];

app.use(express.json());

app.post("/register", (req, res) => {
    let json = req.body;
    if(!json.hasOwnProperty('clientId')) {
        res.status(400).json('Geen client ID opgegeven');
    } else if(clients.includes(json.clientId)) {
        res.status(406).json('Client ID al in gebruik.');
    }
    clients.push({
        id: json.clientId,
        ampere: 0
    });
    console.log(clients[0]);
});

app.post("/update", (req, res) => {
    let json = req.body;
    if(!json.hasOwnProperty('clientId') || !json.hasOwnProperty('ampere')) {
        res.status(400).json('Geen client ID of ampere opgegeven');
    } else if(!clients.includes(json.clientId)) {
        res.status(406).json('Client ID niet herkend.');
    }
    let index = clients.findIndex(client => {
        return client.id === json.clientId;
    })

    clients[index].ampere = json.ampere;
});

app.get("/", (req, res) => {
    let json = req.body;
    if(!clients.includes(json.id)) {
        res.status(406).json('Client ID niet herkend.');
    }
    let index = clients.findIndex(client => {
        return client.id === json.clientId;
    });
    res.json = clients[index];
});

app.listen(port, () => {
    console.log("Server staat aan op poort: " + port);
});
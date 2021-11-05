const express = require('express');
const { MongoClient }= require('mongodb');
const app = express();
const port = 2434;

const url = "mongodb://145.93.176.5:27017";
const client = new MongoClient(url);

const dbName = "Stromi";

client.connect();
const db = client.db(dbName);
const collection = db.collection("stroomgebruik");

let clients = [];

app.use(express.json());

app.post("/register", (req, res) => {
    let json = req.body;
    if(!json.hasOwnProperty('tafelNummer') || json.tafelNummer === undefined) {
        res.status(400).json('Geen tafel nummer opgegeven');
    }
    
    let clientId = clients.length + 1;
    clients.push({
        id: clientId,
        tafelNummer: json.tafelNummer,
        ampere: 0
    });

    let index = clients.findIndex(client => client.id === json.clientId);

    console.log(clients[index]);
    res.json({ id: clientId });
});

app.post("/update", (req, res) => {
    let json = req.body;
    if(!json.hasOwnProperty('clientId') || !json.hasOwnProperty('ampere')) {
        res.status(400).json('Geen client ID of ampere opgegeven');
    } else if(!clients.some(c => c.id === json.clientId)) {
        res.status(406).json('Client niet gevonden.');
        console.log("Opgevraagde client (" + json.clientId + ") niet gevonden!");
        return;
    }

    let index = clients.findIndex(client => {
        return client.id === json.clientId;
    })

    console.log(clients[index]);

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
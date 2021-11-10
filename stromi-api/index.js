const express = require('express');
const { MongoClient }= require('mongodb');
const app = express();
const port = 2435;

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "Stromi";

client.connect();
const db = client.db(dbName);
const collection = db.collection("stroomdata");

let clients = [];

app.use(express.json());

app.post("/register", (req, res) => {
    let json = req.body;
    if(!json.hasOwnProperty('tafelNummer') || json.tafelNummer === undefined) {
        res.status(400).json('Geen tafel nummer opgegeven');
    }
    
    let clientId;

    clientId = clients.length + 1;

    let client = {
        id: clientId,
        tafelNummer: json.tafelNummer,
        ampere: 0
    };

    clients.push(client);

    collection.find( { tafelNummer: json.tafelNummer }).limit(1).count().then((dbcount) => {
        let timeString = Date.now.toString();
        let ampereArray = [
            { [timeString]: 0 }
        ];

        let dbClient = {
            tafelNummer: json.tafelNummer,
            ampereWaardes: ampereArray
        };
        
        if(dbcount < 1) collection.insertOne(dbClient);
        res.json({ id: clientId });
    });
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

    clients[index].ampere = json.ampere;

    console.log(clients[index]);

    let timeString = Date.now().toString();

    collection.updateOne({ tafelNummer: clients[index].tafelNummer }, { $push: {
            ampereWaardes: {
                $each: [{[timeString]: json.ampere}] 
            }
        }
    });

    res.status(200);
});

app.get("/", (req, res) => {
    let json = req.body;
    if(!clients.some(c => c.tafelNummer === json.tafelNummer)) {
        res.status(406).json('Tafelnummer niet herkend.');
    }
    let index = clients.findIndex(client => {
        return client.tafelNummer === json.tafelNummer;
    });

    res.json = clients[index];
});

app.listen(port, () => {
    console.log("Server staat aan op poort: " + port);
});
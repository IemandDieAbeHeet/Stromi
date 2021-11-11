const express = require('express');
const { MongoClient }= require('mongodb');
const cors = require('cors');
const app = express();
app.use(cors());
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
        ampere: []
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

    let timeString = Date.now().toString();

    clients[index].ampere.push({[timeString]: json.ampere});

    console.log(clients[index]);

    collection.updateOne({ tafelNummer: clients[index].tafelNummer }, { $push: {
            ampereWaardes: {
                $each: [{[timeString]: json.ampere}] 
            }
        }
    });

    res.status(200);
});

app.get("/", (req, res) => {
    res.json(clients);
});

app.listen(port, () => {
    console.log("Server staat aan op poort: " + port);
});
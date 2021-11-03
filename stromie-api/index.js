const express = require('express');
const axios = require('axios');
const app = express();
const port = 2434;

let clients = [];

app.use(express.json());

app.post("/registerclient", (req, res) => {
    let json = req.body;
    clients.push(json.clientId);
    console.log("clients");
});

app.get("/sendclient", (req, res) => {
    axios.post('localhost/registerclient', {
        clientId: 23
      })
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
    });
});

app.listen(port, () => {
    console.log("Server staat aan op poort: " + port);
});
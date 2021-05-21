const express = require('express')
const path = require('path')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("./t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");

const httpPort = 8000

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

const app = express()

app.use(express.static(path.join(__dirname, 'views')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.listen(httpPort, async function () {
  console.log(`Listening on port ${httpPort}!`)
})
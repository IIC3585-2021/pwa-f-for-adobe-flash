const express = require('express')
const path = require('path')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("./t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");
const { User } = require('./src/models');

const httpPort = 8000

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

let defaultUser;

const app = express()

app.get('/', function(req, res, next) {
  // const chat =
  console.log(defaultUser)
  // res.render('index', )
})

app.listen(httpPort, async function () {
  console.log(`Listening on port ${httpPort}!`)
  const {data, id} = await User.findOne();
  defaultUser = {data,id}
})
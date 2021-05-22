const express = require('express')
const path = require('path')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("./t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");
const { User, Chat } = require('./src/models');

const httpPort = 8000

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

let defaultUser;

const app = express()

app.set('view engine', 'ejs');

app.get('/', async function(req, res, next) {
  const userChats = await Chat.findAll({where:[{userId1: defaultUser.id},{userId2: defaultUser.id}]})
  console.log(defaultUser)
  // res.render('./src/views/index', {user: defaultUser, chats: userChats})
})

app.listen(httpPort, async function () {
  console.log(`Listening on port ${httpPort}!`)
  const {data, id} = await User.findOne();
  defaultUser = {data,id}
})
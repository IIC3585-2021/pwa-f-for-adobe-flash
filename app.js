const express = require('express')
const path = require('path')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("./t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");
const { User, Chat, Message } = require('./src/models');

const httpPort = 8000

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

let defaultUser;

const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.get('/', async function(req, res, next) {
  const userChats = await Chat.findAll({where:[{userId1: defaultUser.id},{userId2: defaultUser.id}]})
  res.render('index.ejs', {user: defaultUser, chats: userChats})
})

app.get('/chat/:id', async function(req, res, next) {
  const messages = (await Message.findAll({where: {chatId: req.params.id}}))
    .map(message => message.data);
  res.render('chat.ejs', messages)
})

app.post('/message/create', async function(req, res, next) {
  const {content, chatId} = req.body
  const message = {content, chatId, createdAt: new Date()};
  await Message.create(message)
  const messages = (await Message.findAll()).map(message => message.data);
  res.render('chat.ejs', messages)
})

app.listen(httpPort, async function () {
  console.log(`Listening on port ${httpPort}!`)
  const {data, id} = await User.findOne();
  defaultUser = {data,id}
})
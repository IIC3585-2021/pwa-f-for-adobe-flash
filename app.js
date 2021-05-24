const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("./t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");
const { User, Chat, Message } = require('./src/models');
const webpush = require('web-push');
const urlsafeBase64 = require('urlsafe-base64');

const httpPort = 8000

const vapidKeys = webpush.generateVAPIDKeys();

const decodedVapidPublicKey = urlsafeBase64.decode(vapidKeys.publicKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

let defaultUser;

const app = express()

const FCM = require('fcm-node');

const serverKey = 'AAAAePauiRA:APA91bHmS4Xx1poLvBaj_WZq6Lwojo5O0i3P47vfXN4O8LaKsrm9Xk_719tjMRBdvWInd4fGl1nhzPl9n8FTsKyDqSBSF1SLaYSRLx1R9WB8hrUYQqism9WgQkneraTH6XeEj0g3kTvJ'

const fcm = new FCM(serverKey);

app.locals.vp = "BKX-TzuIC3ZtJPMBGn4Ok-l3a9FBRjnCQBcGZvOwbukjtp6bZpF8K8vPX2K8bktmvys08iH1-q8_bpsaAwDYOko";

app.get('/push', function(req, res) {
  subscribers.forEach((subscriber, index) => {
    console.log("ID subscriber " + index + ": " + subscriber)
    let message = {
      to: subscriber
    };
    fcm.send(message, function(err, response){
      if (err) {
        console.log("Something has gone wrong!");
        console.log(err)
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
    res.sendStatus(200)
  })
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "src", "public"));

app.get('/sw.js', function(req,res,next) {
  res.sendFile(path.join(__dirname + '/src/public/sw.js'))
})

app.use('/scripts', express.static(__dirname + '/src/public/scripts'));

app.get('/serviceAccount', function(req,res,next) {
  res.sendFile(path.join(__dirname + '/t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json'))
})

app.get('/manifest.json', function(req,res,next) {
  res.sendFile(path.join(__dirname + '/src/public/manifest.json'))
})

app.get('/icon', function(req,res,next) {
  res.sendFile(path.join(__dirname + '/src/public/img/icons/icon-72x72.png'))
})

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

const subscribers = []

app.post('/subscribers/', function(req, res) {
  //---check that the regid field is there---
  if (!req.body.hasOwnProperty('subscriptionid')){
    res.statusCode = 400;
    res.send('Error 400: Post syntax incorrect.');
    return;
  }
  //console.log(req.body.subscriptionid);
  subscribers.push(req.body.subscriptionid)
  res.statusCode = 200;
  res.send('SubscriptionID received');
});

app.listen(httpPort, async function () {
  console.log(`Listening on port ${httpPort}!`)
  const {data, id} = await User.findOne();
  defaultUser = {data,id}
})
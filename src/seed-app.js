const {User, Contact, Chat, Message} = require('./models.js')
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require("../t4-web-avanzado-firebase-adminsdk-mquh4-4d6254cd6a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 't4-web-avanzado.firebaseapp.com'
});
firebaseSequelizer.initializeApp(admin);

up = async () => {
  const user1 = await User.create({name: "diegoheg"})
  const user2 = await User.create({name: "Okhan"})
  const chat = await Chat.create({userId1: user1.id, userId2: user2.id})
  const message1 = await Message.create(
    {
      chatId: chat.id,
      content: "Hola1",
      userId: user1.id,
      createdAt: new Date(2021, 04, 23, 0, 0, 12),
    })
  const message2 = await Message.create(
    {
      chatId: chat.id,
      content: "Hola2",
      userId: user2.id,
      createdAt: new Date(2021, 04, 23, 0, 5, 12),
    })
};

up();
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
  await User.create({name: "diegoheg"})
  await User.create({name: "OKhan"})
};

up();
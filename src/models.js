const {defineModel} = require("firestore-sequelizer");

const Message = defineModel("message", {
    content: "",
    chatId: "",
    createdAt: {
      type: "date",
    },
});

const Chat = defineModel("chat", {
    userId1: "",
    userId2: "",
});

const Contact = defineModel("contact", {
    userId: "",
    name: "",
});

const User = defineModel("users", {
    name: "",
}, {subcollections: [Message, Chat, Contact]});

module.exports = {User, Contact, Chat, Message};
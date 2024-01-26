const {Schema, model, ObjectId} = require("mongoose");

const Message
    = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    chat: {
        type: ObjectId,
        ref: 'Chat'
    },
    text: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = model('Message', Message);
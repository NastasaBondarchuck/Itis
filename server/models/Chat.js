const {Schema, model, ObjectId} = require("mongoose");

const Chat
    = new Schema({
    userList:[{
        type: ObjectId,
        ref: 'User'
    }],
    name: {type: String},
    messageStore: [{
        type: ObjectId,
        ref: 'Message'
    }]
})

module.exports = model('Chat', Chat);
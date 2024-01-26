const {Schema, model,  ObjectId} = require("mongoose");

const Location
    = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    messageStore: [{
        type: ObjectId,
        ref: 'Message'
    }],
    image: {
        type: String,
        default: "../../client/src/img/icon_ellipse.png",
    }
})

module.exports = model('Location', Location);
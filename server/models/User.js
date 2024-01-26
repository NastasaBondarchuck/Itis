const {Schema, model, ObjectId} = require("mongoose");

const User
    = new Schema({
    login:          {type: String, required: true, unique: true,},
    password:       {type: String, required: true,},
    name:           {type: String, required: true, default: ' ',},
    birthdate:      {type: Date, default: Date},
    position:       {type: String, default: ' '},
    genus:           {type: String, default: ' '},
    bio:            {type: String, default: ' '},
    friendsList:
        [{
        type: ObjectId,
        ref: 'User',
    }],
    chatsList:      [{
        type: ObjectId,
        ref: 'Chat',
    }],
    imageFull:      {type: String,
                    default: "../../client/src/img/profile_image.png",},
    imageEllipse:   {type: String,
                    default: "icon_ellipse.png",},
    admin:          {type: Boolean, required: true, default: false,}
})

module.exports = model('User', User);
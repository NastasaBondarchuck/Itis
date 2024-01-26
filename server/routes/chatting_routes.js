const Router = require("express");
const router = new Router();
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleWare = require("../middleware/auth.middleware");

router.get("/my_chats", async (req, res) => {
    try {
        const {login, newUser} = req.body;
        const user = await User.findOne({login});
        console.log(user);
        return res.json({user});
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})

router.post("/", authMiddleWare, async (req, res) => {
    try {
        console.log(req.user);
        console.log(req.body);

        const peers = [req.user._id, req.body.peerId];
        let chat = await Chat.findOne({userList: { "$size" : 2, "$all": peers }  });
        if (!chat) {
            console.log("chat not found");
            let peer = await User.findById(req.body.peerId);
            if (!peer) {
                res.status(404).json({message: "Peer not found"});
                return;
            }

            chat = new Chat({name: `chat between ${req.user._id} and ${peer._id}`, userList: peers });
            await chat.save();
        }

        res.json(chat);
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})

router.get("/:id", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (chat)
            res.json(chat);
        else
            res.status(404).json({message: "Chat not found"});
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
});

function initSocketio(io) {
    io.on("connection", (socket) => {
        socket.on("join_chat", (data) => {
            if (data.chatId) {
                socket.join(`chat:${data.chatId}`);
            }
        });
    });

    router.post("/:chatId/messages", authMiddleWare, async (req, res) => {
        try {
            const chat = await Chat.findById(req.params.chatId);
            if (!chat) {
                res.status(404).json({message: "Chat not found"});
                return;
            }

            const msg = new Message({user: req.user._id, chat, text: req.body.text });
            await msg.save();
            await msg.populate("user");

            io.to(`chat:${chat._id}`).emit("message", msg);
            res.json(msg);
        } catch (e) {
            console.log(e);
            res.send({message: "Server error"});
        }
    });

    router.get("/:chatId/messages", async (req, res) => {
        try {
            const messages = await Message.find({chat: req.params.chatId}).populate("user").populate("chat").exec();
            res.json(messages);
        } catch (e) {
            console.log(e);
            res.send({message: "Server error"});
        }
    })
}

module.exports = { router, initSocketio };

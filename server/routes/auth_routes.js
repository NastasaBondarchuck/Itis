const Router = require("express");
const router = new Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleWare = require("../middleware/auth.middleware");

router.post("/new_account", async (req, res) => {
    try {
        const {login, password} = req.body;
        const candidate = await User.findOne({login});
        if (candidate) {
            return res.status(400).json({message: `User with login ${login} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = new User({login: login, password: hashPassword, name: login});
        await user.save();
        return res.json({message: `User was created`})
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})


router.post("/current_account", async (req, res) => {
    try {
        const {login, password} = req.body;
        const user = await User.findOne({login});
        if (!user) {
            return res.status(404).json({message: `User with login ${login} is not exist`});
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: `Password is invalid`});
        }
        const token = jwt.sign({_id: user._id}, config.get("secretKey"), {expiresIn: "1h"});
        return res.json({
            token,
            user:
                {
                    _id: user._id,
                    login: user.login,
                    name: user.name,
                    birthdate: user.birthdate,
                    position: user.position,
                    genus: user.genus,
                    bio: user.bio,
                    friendsList: user.friendsList,
                    chatsList: user.friendsList,
                    imageFull: user.imageFull,
                    imageEllipse: user.imageEllipse,
                    admin: user.admin,
                },
            message: `User authorized`
        })
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})
router.get("/auth", authMiddleWare,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id});
            const token = jwt.sign({_id: user._id}, config.get("secretKey"), {expiresIn: "1h"});
            console.log(user);
            return res.json({
                token,
                user:
                    {
                        _id: user._id,
                        login: user.login,
                        name: user.name,
                        birthdate: user.birthdate,
                        position: user.position,
                        genus: user.genus,
                        bio: user.bio,
                        friendsList: user.friendsList,
                        chatsList: user.friendsList,
                        imageFull: user.imageFull,
                        imageEllipse: user.imageEllipse,
                        admin: user.admin,
                    }
            })
        } catch (e) {
            console.log(e);
            res.send({message: "Server error"});
        }
    })

module.exports = router;
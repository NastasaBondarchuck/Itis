const Router = require("express");
const router = new Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleWare = require("../middleware/auth.middleware");

router.patch("/update_account", async (req, res) => {
    try {
        const {login, newUser} = req.body;
        const user = await User.findOneAndUpdate({login}, newUser, {new: true});
        console.log(user);
        return res.json({user});
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})

module.exports = router;
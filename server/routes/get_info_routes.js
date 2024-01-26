const Router = require("express");
const router = new Router();
const User = require("../models/User");
const Location = require("../models/Location");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        if (users) return res.json(users);
        else return res.json([]);
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})

router.get("/users/find", async (req, res) => {
    try {
        console.log(req);
        const user = await User.find({name: req.query.name});
        if (user) return res.json(user);
        else return res.json("");
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})

router.get("/users/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (user)
            res.json(user);
        else
            res.status(404).json({message: "User not found"})
    } catch (e) {
        console.log(e);
        res.status(500).send({message: "Server error"});
    }
})

router.get("/locations/find", async (req, res) => {
    console.log(req);
    const user = await Location.findOne({name: req.query.name});
    if (user) return res.json(user);
    else return res.json("");
})

router.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find();
        if (locations) return res.json(locations);
        else return res.json([]);

    } catch (e) {
        console.log(e);
        res.send({message: "Server error"});
    }
})


module.exports = router;
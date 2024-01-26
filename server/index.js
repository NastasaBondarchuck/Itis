const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const PORT = config.get('serverPort');
const authRouter = require("./routes/auth_routes");
const updateRouter = require("./routes/update_routes");
const getInfoRouter = require("./routes/get_info_routes");
const { router: chattingRouter, initSocketio: initChatSocketio } = require("./routes/chatting_routes");
const corsMiddleware = require("./middleware/cors.middleware");
const {Server} = require("socket.io");
const http = require("http");


const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/update", updateRouter);
app.use("/api/chat", chattingRouter);
app.use("/api", getInfoRouter);
app.use("/test", (req, res) => {
    console.log("Test")
    res.status(201).send();
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "PUT"],
    }
});

initChatSocketio(io);

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"));

        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}
start();
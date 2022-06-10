/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const socketIo = require("socket.io");
const http = require("http");
const socketController = require("./src/socket");

// route here
const categoryRoute = require("./src/routers/category.route");

const app = express();
app.use(cors());
app.use(
	helmet({
		crossOriginResourcePolicy: false,
	})
);
app.use(xss());
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.json({ message: "Hello World" });
});
app.use(express.static("public"));

// auth route
app.use(require("./src/routers/auth.route"));
app.use(require("./src/routers/user.route"));
app.use(require("./src/routers/product.route"));
app.use(categoryRoute);

const APP_PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
	},
});
io.on("connection", (socket) => {
	console.log("new user connected");
	socketController(io, socket);
});
server.listen(APP_PORT, () => {
	console.log(`Service running on port ${APP_PORT}`);
});
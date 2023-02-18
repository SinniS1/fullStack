const PORT = process.env.PORT || 3001;
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// files ---------------------------------------------------------------------------------------------------
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorMiddleware");
const corsOptons = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

// ---------------------------------------------------------------------------------------------------------
connectDB();
// logger -> custom middelware for file logs
app.use(logger);

// CORS -> Cross Origing Request Service
app.use(cors(corsOptons));

// built-in middelware for all the static files like img, css, favicon etc go here
app.use(express.static(path.join(__dirname, "/public")));

// built-in middelware for josn file go here
app.use(express.json());

// 3rd-party middelware for cookie parsing
app.use(cookieParser());

// routes
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "This json file does not exits" });
	} else {
		res.type("txt").send("404 this file is not found");
	}
});

// Custom middleware for error logs
app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => {
		console.log(`Server running on ${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(`${err.no}: ${err.code}\t${err.syscall}]\t${err.hostname}`, "monogErrLog.log");
});

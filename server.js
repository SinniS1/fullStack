const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

// logger
app.use((req, res, next) => {
	console.log(`method: ${req.method}   path: ${req.url}`);
	next();
});

// for all the static files like img, css, favicon etc go here
app.use(express.static(path.join(__dirname, "/public")));

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
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});

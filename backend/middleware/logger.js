const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, fileName) => {
	const dateTime = format(new Date(), "dd-MM-yyy\thh:mm:ss");
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}
		await fsPromises.appendFile(path.join(__dirname, "..", "logs", fileName), logItem);
	} catch (error) {
		console.log(error);
	}
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t,${req.headers.origin}`,"reqLogs.log")
	console.log(`method: ${req.method}   path: ${req.url}`);
	next();
};
module.exports = { logEvents, logger };

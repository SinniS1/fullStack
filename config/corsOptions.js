const allowedOrigins = [
	"http://localhost:3000",
	// "https://google.com",
	// "https://www.google.com"
];

const corsOptons = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allwed by CORS"));
		}
	},
	Credential: true,
	optionsSucceesStatus: 200,
};

module.exports = corsOptons;

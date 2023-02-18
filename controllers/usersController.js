const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").lean();
	// we are using find() method on User model to find the users.
	// select method is used to tell what or what not should be passed here passwrod not passed
	// lean will tell the mongoose to only give json file of users and not any other documentations
	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}
	res.json(users);
});

// @desc Create new User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;
	// confirm data
	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: "All fields are required" });
	}
	// check for duplicates
	const duplicate = await User.findOne({ username }).lean().exec();
	if (duplicate) {
		return res.status(409).json({ message: "Duplicate username" });
	}
	// Hash Paswrord
	const hashedPwd = await bcrypt.hash(password, 10); // 10 are salt rounds
	const userObject = { username, passwrod: hashedPwd, roles };
	// create and store new user
	const user = await User.create(userObject);
	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: "Invalid userdata received" });
	}
});

// @desc Update a User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password } = req.body;
	// confirm data
	if (!id || typeof active !== "boolean" || !username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const user = await User.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: "User not found for updation" });
	}

	// duplicates
	const duplicate = await User.findOne({ username }).lean().exec();
	// allow updates to original user
	if (duplicate && duplicate?._id.toString() !== id) {
		// if your username is duplicate but not you id which means you are updating username which already exitst
		return res.status(400).json({ message: "Duplicate Username" });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;
	// if password is passed then change the password
	if (password) {
		// hasshing password
		user.password = await bcrypt.hash(password, 10); // 10 are salt on pass;
	}
	const updatedUser = await user.save();
	res.json({ message: `${updatedUser.username} updated` });
});

// @desc delete a User
// @route PATCH /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: "User ID is Required" });
	}

	const notes = await Note.findOne({ user: id }).lean().exec();
	if (notes?.length) {
		return res.status(400).json({ message: "User has assigned Notes" });
	}
	const user = await User.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: "User does not exists" });
	}
	const result = await user.deleteOne();
	const reply = `Username ${result.username} with ID ${result._id} deleted`;
	res.json(reply);
});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};

/* NOTES
asyncHandler -> It is a middleware which simplifies the HTTP request
exec() -> exec should always be used when you need to fetch user 




*/

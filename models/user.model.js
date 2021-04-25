const mongoose = require("mongoose");
const { validateEmail } = require("../helper/helperFunctions");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			//validate: [validateEmail, 'not a valid email']
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"not a valid email",
			],
		},
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);
const userModel = mongoose.model("users", userSchema);

module.exports.userModel = userModel;

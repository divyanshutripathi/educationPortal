const mongoose = require("mongoose");
const { validateEmail } = require("../helper/helperFunctions");
const saltSchema = new mongoose.Schema(
	{
		salt: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
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
	},
	{ timestamps: true }
);
const saltModel = mongoose.model("salts", saltSchema);
module.exports.saltModel = saltModel;

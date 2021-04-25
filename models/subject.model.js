const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema(
	{
		subjectName: {
			type: String,
			required: true,
		},
		stream: {
			type: String,
			required: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		lastModifiedUserID: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
const subjectModel = mongoose.model("subjects", subjectSchema);
module.exports.subjectModel = subjectModel;

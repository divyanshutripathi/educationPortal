const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
	{
		courseName: {
			type: String,
			required: true,
		},
		subjects: [
			{
				type: String,
			},
		],
		type: {
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
const courseModel = mongoose.model("courses", courseSchema);
module.exports.courseModel = courseModel;

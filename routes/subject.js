const express = require("express");
const router = express.Router();
const { subjectModel } = require("../models/subject.model");
const { userModel } = require("../models/user.model");
const { authenticateJWT } = require("../middlewares/jwtAuthenticator");

/**
 * API for adding new subject
 * @param
 * { 
 * 	subject
 *  stream
 * }
 */
router.post("/addNew", authenticateJWT, async (req, res) => {
	try {
		if (!req.body.subjectName || !req.body.stream) {
			res.json({
				message: "Insufficient Data",
				status: 400,
			});
		}
		const isAdmin = await userModel.findOne({
			_id: req.user.userId,
			isAdmin: true,
		});
		if (!isAdmin) {
			return res.json({
				message: "User is not Authorized to add Course",
				status: 400,
			});
		}
		let subjectDetails = new subjectModel({
			subjectName: req.body.subjectName,
			stream: req.body.stream,
			lastModifiedUserID: req.user.userId,
			// createdAt: new Date()
		});
		const subject = await subjectDetails.save();
		return res.json({
			message: "subject added Successfully",
			subject,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			errorCode: error.status || 400,
			message: "error response",
		});
	}
});

/**
 * API for fetching subject
 */
router.get("/list", async (req, res) => {
	try {
		let pageSize = req.query.pageSize || 10;
		const query = { deleted: false };
		const subjects = await subjectModel
			.find(query)
			.sort({ createdAt: -1 })
			.limit(pageSize);
		return res.json({
			message: "list of subjects",
			subjects,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			errorCode: error.status || 400,
			message: "error response",
		});
	}
});

/**
 * API for deleting a subject
 * @param
 * { 
 * 	subjectId
 * }
 */
router.post("/delete", authenticateJWT, async (req, res) => {
	try {
		if (!req.body.subjectId) {
			return res.json({
				message: "Insufficient Data",
				status: 400,
			});
		}
		const isAdmin = await userModel.findOne({
			_id: req.user.userId,
			isAdmin: true,
		});

		if (!isAdmin) {
			return res.json({
				message: "User is not Authorized to delete subject",
				status: 400,
			});
		}
		const subject = await subjectModel.findOne({
			_id: req.body.subjectId,
			deleted: false,
		});
		if (!subject) {
			return res.json({
				message: `subject ${req.body.subjectId} does not exist`,
				status: 400,
			});
		}
		const removedSubject = await subjectModel.updateOne(
			{
				_id: req.body.subjectId,
			},
			{
				deleted: true,
				lastModifiedUserID: req.user.userId,
			}
		);
		if (!(removedSubject && removedSubject.nModified)) {
			return res.json({
				message: "unable to delete subject",
			});
		}
		return res.json({
			message: "subject deleted successfully",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			errorCode: error.status || 400,
			message: "error response",
		});
	}
});

module.exports = router;

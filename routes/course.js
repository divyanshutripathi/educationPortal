const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/jwtAuthenticator");
const { courseModel } = require("../models/course.model");
const { subjectModel } = require("../models/subject.model");
const { userModel } = require("../models/user.model");

/**
 * API for adding a new course
 * @param
 * { 
 * 	courseName
 *  subjects
 *  type
 * }
 */
router.post("/addNew", authenticateJWT, async (req, res) => {
	try {
		if (
			!req.body.courseName ||
			!Array.isArray(req.body.subjects) ||
			req.body.subjects.length === 0 ||
			!req.body.type
		) {
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
				message: "User is not Authorized to add Course",
				status: 400,
			});
		}
		let courseDetails = new courseModel({
			courseName: req.body.courseName,
			subjects: req.body.subjects,
			type: req.body.type,
			lastModifiedUserID: req.user.userId,
			// createdAt: new Date()
		});
		const course = await courseDetails.save();
		return res.json({
			message: "course added Successfully",
			course,
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
 * API for list of courses
 * filter can be applied on subjects,type, stream
 */
router.get("/list", authenticateJWT, async (req, res) => {
	try {
		let query = {};
		if (Array.isArray(req.query.subjects) && req.body.subjects.length > 0) {
			query = { subjects: { $in: req.query.subjects } };
		}
		if (req.query.type) {
			query = { type: req.query.type };
		}
		if (req.query.stream) {
			const subjects = await subjectModel.distinct("subjectName", {
				stream: req.query.stream,
			});
			if (!subjects) {
				return res.json({
					message: "stream does not have any subjects",
					status: 400,
				});
			}
			query = { subjects: { $in: subjects } };
		}
		query.deleted = false;
		const courses = await courseModel.find(query).sort({ createdAt: -1 });
		return res.json({
			message: "list of courses",
			courses,
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
 * API for deleting a course
 * @param
 * { 
 * 	courseId
 * }
 */
router.post("/delete", authenticateJWT, async (req, res) => {
	try {
		if (!req.body.courseId) {
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
				message: "User is not Authorized to delete Course",
				status: 400,
			});
		}
		const course = await courseModel.findOne({
			_id: req.body.courseId,
			deleted: false,
		});
		if (!course) {
			return res.json({
				message: `course ${req.body.courseId} does not exist`,
				status: 400,
			});
		}
		const removedCourse = await courseModel.updateOne(
			{
				_id: req.body.courseId,
			},
			{
				deleted: true,
				lastModifiedUserID: req.user.userId,
			}
		);
		if (!(removedCourse && removedCourse.nModified)) {
			return res.json({
				message: "unable to delete course",
			});
		}
		return res.json({
			message: "course deleted successfully",
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

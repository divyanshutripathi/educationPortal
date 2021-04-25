const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user.model");
const { saltModel } = require("../models/salt.model");
const { hash, generateSalt } = require("../helper/hashing");
const {
	generateJWT,
	authenticateJWT,
} = require("../middlewares/jwtAuthenticator");

/**
 * SignUp API
 * @param
 * { 
 * 	email
 *  username
 * 	name
 * 	Password
 * }
 */
router.post("/signUp", async (req, res) => {
	try {
		if (
			!req.body.userName ||
			!req.body.name ||
			!req.body.password ||
			!req.body.email
		) {
			return res.json({
				message: "Insufficient Data",
				status: 400,
			});
		}

		const checkUser = await userModel.findOne({ email: req.body.email });
		if (!!checkUser) {
			return res.json({
				message: "user already exists",
				status: 400,
			});
		}
		const password = hash(req.body.password, generateSalt(12));
		let userDetails = new userModel({
			userName: req.body.userName,
			name: req.body.name,
			password: password.hashedpassword,
			email: req.body.email,
			// createdAt: new Date()
		});

		let saltDetails = new saltModel({
			salt: password.salt,
			email: req.body.email,
			userName: req.body.userName,
			// createdAt: new Date()
		});

		const saltAfterSave = await saltDetails.save();
		if (saltAfterSave) {
			const user = await userDetails.save();
			if (!user) {
				return res.json({
					message: "some error occured while creating user",
					status: 400,
				});
			}
			const token = await generateJWT(user._id);

			return res.json({
				message: "user created",
				email: user.email,
				token,
			});
		}
	} catch (error) {
		return res.json({
			error: error.message,
			errorCode: error.status || 400,
			message: "error response",
		});
	}
});

/**
 * SignIn API -
 * @param
 * { 
 * 	email or username
 * 	Password
 * }
 */
router.post("/signIn", async (req, res) => {
	try {
		if (!(req.body.email || req.body.userName) || !req.body.password) {
			return res.json({
				message: "Insufficient Data",
				status: 400,
			});
		}
		const saltQuery = req.body.email
			? { email: req.body.email }
			: { userName: req.body.userName };
		const salt = await saltModel.findOne(saltQuery);
		if (!salt) {
			return res.json({
				message: "details of the user not found",
				status: 400,
			});
		}
		const password = hash(req.body.password, salt.salt);
		const query = req.body.email
			? { email: req.body.email, password: password.hashedpassword }
			: { userName: req.body.userName, password: password.hashedpassword };
		const user = await userModel.findOne(query);
		if (!user) {
			return res.json({
				message: "Email or Password Incorrect",
				status: 400,
			});
		} else {
			token = await generateJWT(user._id);
			return res.json({
				message: "user succesfully signed In",
				email: user.email,
				token,
			});
		}
	} catch (error) {
		return res.json({
			error: error.message,
			errorCode: error.status || 400,
			message: "error response",
		});
	}
});
/**
 * API for Making a User Admin
 * * @param
 * { 
 * 	email of the user who wants to become admin
 * }
 */
router.post("/makeAdmin", authenticateJWT, async (req, res) => {
	try {
		const userId = req.user.userId;
		if (!req.body.email) {
			return res.json({
				message: "Please provide email of user to make admin",
				status: 400,
			});
		}
		const adminUser = await userModel.findOne({ _id: userId, isAdmin: true });
		if (!adminUser) {
			return res.json({
				message: "User is not an admin",
				status: 400,
			});
		}
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) {
			return res.json({
				message: `${req.body.email} does not exist`,
				status: 400,
			});
		} else if (user.isAdmin) {
			return res.json({
				message: `${req.body.email} is already an admin`,
			});
		}
		const newAdmin = await userModel.updateOne(
			{ email: req.body.email },
			{ isAdmin: true }
		);
		if (!newAdmin.nModified) {
			return res.json({
				message: `admin updation failed`,
				status: 400,
			});
		}
		return res.json({
			message: `${req.body.email} is admin now`,
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

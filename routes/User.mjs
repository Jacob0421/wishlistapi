import express from "express";
import mongoose from "mongoose";

// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
import crypto from "crypto";

const router = express.Router();

const userSchema = new mongoose.Schema(
	{
		FirstName: { type: String, required: true },
		LastName: { type: String, required: true },
		Email: { type: String, required: true, unique: true },
		Password: { type: String, required: true },
		Salt: { type: String, required: true },
		Token: { type: String, required: true },
	},
	{ collection: "Users" }
);

const User = mongoose.model("User", userSchema);

router.post("/", async (req, res) => {
	const { fname, lname, password: plaintextPass, email } = req.body;

	const salt = await bcrypt.genSaltSync(20);
	const password = await bcrypt.hashSync(plaintextPass, salt);
	const token = await crypto.randomBytes(10).toString("base64url");
	try {
		const response = await User.create({
			fname,
			lname,
			email,
			password,
			salt,
			token,
		});

		res.send(response).status(200);
	} catch (error) {
		console.log(JSON.stringify(error));
		if ((error.code = 11000)) {
			return res.send({ status: "error", error: "email already exists" });
		}
		throw error;
	}
});

export default router;

import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
const bcrypt = await import("bcrypt");
const crypto = await import("node:crypto");
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
	LogRequest("Post");

	const { email, password } = req.body;
	const query = { EMailAddress: email };

	const collection = MongoDB.collection("Users");
	const user = await collection.findOne(query);

	if (!user) {
		return res.send(`Login failed. Please try again.`).status(401);
	}

	if (!(await bcrypt.compare(password, user.Password))) {
		return res.send(`Login failed. Please try again.`).status(401);
	}

	const token = jsonwebtoken.sign(
		{
			ID: user._id,
			EMailAddress: user.EMailAddress,
		},
		// This needs to be changed when app goes live
		"This_is_my_test_secret_key",
		{
			//this needs to be changed to an acceptable limit once go live
			expiresIn: "30d",
		}
	);

	return res
		.cookie("token", token, {
			httpOnly: false,
			// Set to true for https webpage
			// httpOnly: true,
			secure: true,
			sameSite: "none",
		})
		.status(200)
		.json({ message: "User successfully logged in" });
});

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Login] Recieved a ${requestType} request`);
}

export default router;

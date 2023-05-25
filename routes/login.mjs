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
		"This_is_my_test_secret_key",
		{
			expiresIn: "30d",
		}
	);

	return res.send(token).status(200);
});

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Login] Recieved a ${requestType} request`);
}

export default router;

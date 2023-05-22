import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
const bcrypt = await import("bcrypt");
const crypto = await import("node:crypto");

const router = express.Router();

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Login] Recieved a ${requestType} request`);
}

router.post("/", async (req, res) => {
	LogRequest("Post");

	const { email, password } = req.body;

	const query = { EMailAddress: email };
	const collection = await MongoDB.collection("Users");

	const user = await collection.findOne(query);

	if (!user) {
		console.log("User not Found");
		return res
			.send(`User not found for ${email}. Please try again.`)
			.status(404);
	} else {
		let isValidated = await bcrypt.compare(password, user.Password);

		if (!isValidated) {
			return res.send("Password not correct.").status(401);
		}
		const updates = {
			$set: {
				token: await crypto.randomBytes(48).toString("base64url"),
			},
		};

		collection
			.updateOne(query, updates)
			.then((result) => {
				console.log(result);
				return res.send(result).status(200);
			})
			.catch((err) => {
				return res.send(err).status(501);
			});
	}
});

export default router;

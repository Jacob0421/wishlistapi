import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
const bcrypt = await import("bcrypt");
const crypto = await import("node:crypto");

const router = express.Router();

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Users] Recieved a ${requestType} request`);
}

router.get("/", async (req, res) => {
	LogRequest("GET (all)");

	let collection = MongoDB.collection("Users");
	let results = collection.find({});
	res.send(results).status(200);
});

router.post("/", async (req, res) => {
	LogRequest("POST");

	const { FirstName, LastName, Email, Password } = req.body;

	let salt = await bcrypt.genSalt(10);
	console.log(`${Password} ${salt}`);
	let hashedPass = await bcrypt.hash(Password, salt);
	let token = crypto.randomBytes(48).toString("base64url");

	let newDocument = {
		_id: uuid(),
		FirstName: FirstName,
		LastName: LastName,
		EMailAddress: Email,
		Password: hashedPass,
		Salt: salt,
		Token: token,
	};

	let collection = await MongoDB.collection("Users");
	let result = collection.insertOne(newDocument);
	res.send(result).status(204);
});

export default router;

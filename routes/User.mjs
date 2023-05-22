import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
const bcrypt = await import("bcrypt");
const crypto = await import("node:crypto");

const router = express.Router();

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Items] Recieved a ${requestType} request`);
}

router.get("/", async (req, res) => {
	LogRequest("GET (all)");

	let collection = MongoDB.collection("Users");
	let results = collection.find({});
	res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
	LogRequest("GET (single)");

	const query = { _id: req.params.id };
	const collection = await MongoDB.collection("Users");

	let result = await collection.findOne(query);

	if (!result) {
		res.send("Not found").status(404);
	} else {
		res.send(result).status(200);
	}
});

router.post("/", async (req, res) => {
	LogRequest("POST");

	const { FirstName, LastName, Email, Password: plnTxtPass } = req.body;

	let salt = await bcrypt.genSalt(10);
	let hashedPass = await bcrypt.hash(plnTxtPass, salt);
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

router.patch("/:id", async (req, res) => {
	LogRequest("PATCH");

	const userUpdates = {
		$set: {
			FirstName: req.body.fname,
			LastName: req.body.lname,
			Email: req.body.email,
		},
	};

	const query = { _id: req.params.id };
	const collection = await MongoDB.collection("Users");

	let result = await collection.updateOne(query, userUpdates);

	res.send(result).status(200);
});

router.delete("/:id", async (req, res) => {
	LogRequest("DELETE");

	const query = { _id: req.params.id };
	const collection = await MongoDB.collection("Users");

	let result = await collection.deleteOne(query);

	res.send(result).status(200);
});

export default router;

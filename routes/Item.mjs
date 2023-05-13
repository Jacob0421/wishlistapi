import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

const router = express.Router();

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Items] Recieved a ${requestType} request`);
}
//fetch all
router.get("/", async (req, res) => {
	LogRequest("GET (all)");

	let collection = await MongoDB.collection("Items");
	let results = await collection.find({}).toArray();
	res.send(results).status(200);
});

//fetch 1 by id
router.get("/:id", async (req, res) => {
	LogRequest("GET (single)");

	let collection = await MongoDB.collection("Items");
	let query = {
		_id: new ObjectId(req.params._id),
	};
	let result = await collection.findOne(query);

	if (!result) {
		req.send("Not Found").status(404);
	} else {
		res.send(result).status(200);
	}
});

//Create
router.post("/", async (req, res) => {
	LogRequest("POST");

	let newDocument = {
		_id: uuid(),
		Name: req.body.ItemName,
		URL: req.body.ItemURL,
		Picture: req.body.ItemPicture,
		Price: req.body.ItemPrice,
	};

	let collection = await MongoDB.collection("Items");
	let result = await collection.insertOne(newDocument);
	res.send(result).status(204);
});

//Update by id
router.patch("/:id", async (req, res) => {
	LogRequest("PATCH");

	const query = { _id: req.params.id };
	const updates = {
		$set: {
			Name: req.body.name,
			URL: req.body.url,
			Picture: req.body.imgURL,
			Price: req.body.price,
		},
	};

	let collection = await MongoDB.collection("Items");
	let result = await collection.updateOne(query, updates);

	res.send(result).status(200);
});

//Delete record by id
router.delete("/:d", async (req, res) => {
	LogRequest("DELETE");

	const query = { _id: new ObjectId(req.params.id) };
	const collection = await MongoDB.collection("Items");
	let result = await collection.deleteOne(query);

	res.send(result).status(200);
});

export default router;

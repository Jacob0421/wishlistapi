import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

//fetch all
router.get("/", async (req, res) => {
	let collection = await MongoDB.collection("Items");
	let results = await collection.find({}).toArray();
	res.send(results).status(200);
});

//fetch 1 by id
router.get("/:id", async (req, res) => {
	let collection = await MongoDB.collection("Items");
	let query = {
		_id: new ObjectId(req.params.id),
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
	let newDocument = {
		_id: req.body.ItemId,
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
router.patch("/", async (req, res) => {
	const query = { _id: new ObjectId(req.params.id) };
	const updates = {
		$set: {
			name: req.body.name,
			position: req.body.position,
			level: req.body.level,
		},
	};
	let collection = await MongoDB.collection("Items");
	let result = await collection.updateOne(query, updates);

	res.send(result).status(200);
});

//Delete record by id
router.delete("/:d", async (req, res) => {
	const query = { _id: new ObjectId(req.params.id) };
	const collection = await MongoDB.collection("Items");
	let result = await collection.deleteOne(query);

	res.send(result).status(200);
});

export default router;

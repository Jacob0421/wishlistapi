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

	return res.send(results).status(200);
});

//fetch 1 by id
router.get("/:id", async (req, res) => {
	LogRequest("GET (single)");

	let query = { _id: req.params.id };

	let collection = MongoDB.collection("Items");
	collection.findOne(query).then((item) => {
		if (!item) {
			return res.send("item not found").status(404);
		}

		return res.send(item).status(200);
	});
});

//Create
router.post("/", async (req, res) => {
	LogRequest("POST");

	const { Name, URL, Picture, Price } = req.body;

	let newDocument = {
		_id: uuid(),
		Name: Name,
		URL: URL,
		Picture: Picture,
		Price: Price,
	};

	let collection = MongoDB.collection("Items");

	collection
		.insertOne(newDocument)
		.then((insertResult) => {
			return res.send(insertResult.insertedId).status(200);
		})
		.catch((error) => {
			return res.send(error).status(400);
		});
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

	let collection = MongoDB.collection("Items");
	let result = await collection.updateOne(query, updates);

	res.send(result).status(200);
});

//Delete record by id
router.delete("/:id", async (req, res) => {
	LogRequest("DELETE");

	const query = { _id: req.params.id };
	const collection = await MongoDB.collection("Items");

	let result = await collection.deleteOne(query);

	res.send(result).status(200);
});

export default router;

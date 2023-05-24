import express from "express";
import MongoDB from "../MongoDB/DBconnection.mjs";
const bcrypt = await import("bcrypt");
const crypto = await import("node:crypto");

const router = express.Router();

function LogRequest(requestType) {
	let timeStamp = new Date();
	console.log(`${timeStamp}: [Login] Recieved a ${requestType} request`);
}

function findUser(collection, query) {
	return collection.findOne(query).then((user) => {
		if (user) {
			return user;
		} else {
			return Promise.reject("User");
		}
	});
}

async function comparePassword(requestPassword, passwordHash) {
	return bcrypt.compare(requestPassword, passwordHash).then((result) => {
		if (result) {
			return true;
		} else {
			return Promise.reject("Password");
		}
	});
}

router.post("/", async (req, res) => {
	LogRequest("Post");

	const { email, password } = req.body;
	const query = { EMailAddress: email };

	const collection = MongoDB.collection("Users");

	findUser(collection, query)
		.then((user) => {
			return comparePassword(password, user.Password);
		})
		.then((result) => {
			return res.send("Password validation succeeded.").status(201);
			/*	JWT Expression goes here	*/
		})
		.catch((error) => {
			switch (error) {
				case "Collection":
					return res
						.send(
							`There was an error retrieving the collection. Please try again.\n${error}`
						)
						.status(500);
					break;
				case "User":
				case "Password":
					return res
						.send(`Login failed. Please try again.`)
						.status(401);
					break;

				default:
					return res.send(error);
			}
		});
});

export default router;

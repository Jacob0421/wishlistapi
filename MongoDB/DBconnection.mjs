import { MongoClient } from "mongodb";
const connectionstring = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionstring);

let conn;
try {
	conn = await client.connect();
} catch (e) {
	console.log(e);
}

let MongoDB = conn.db("Wishlist-Dev");

export default MongoDB;

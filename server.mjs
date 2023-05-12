import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "./loadEnvironment.mjs";
import Items from "./routes/Item.mjs";
import Users from "./routes/User.mjs";

const _port = process.env.port || 5050;
const connectionstring = process.env.ATLAS_URI || "";

try {
	mongoose.connect(connectionstring, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
} catch (e) {
	console.log(e);
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("Connected successfully.");
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/Items", Items);
app.use("/Users", Users);

app.listen(_port, () => {
	console.log(`Server is running on port: ${_port}`);
});

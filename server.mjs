import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import Items from "./routes/Item.mjs";
import Users from "./routes/User.mjs";
import Login from "./routes/Login.mjs";

const _port = process.env.port || 5050;
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/Items", Items);
app.use("/Users", Users);
app.use("/Login", Login);

app.listen(_port, () => {
	console.log(`Server is running on port: ${_port}`);
});

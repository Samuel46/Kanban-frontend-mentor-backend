import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

//
import { mongoConnect } from "./src/config/mongoConnect";
import { errorHandler } from "./src/middleware/error-handler";
import { NotFoundError } from "./src/errors/not-found-error";
// routes
import { boardRouter } from "./src/routes/boardRoutes";
import { taskRouter } from "./src/routes/taskRoutes";
import { corsOptions } from "./src/config/corsOptions";

const PORT = process.env.PORT || 5050;

interface OptionsJson {
	limit: string;
	extended: boolean;
}

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true } as OptionsJson));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// routes
app.get("/", (req, res) => {
	res.send("hello word");
});
app.use(boardRouter);
app.use(taskRouter);

// 404 route
app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

// connect to the database
mongoose.set("strictQuery", false);
mongoConnect();

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

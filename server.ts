require("dotenv").config();
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import mongoose from "mongoose";
import { json } from "body-parser";

//
import { mongoConnect } from "./src/config/mongoConnect";
import { errorHandler } from "./src/middleware/error-handler";
import { NotFoundError } from "./src/errors/not-found-error";
// routes
import { boardRouter } from "./src/routes/boardRoutes";
import { taskRouter } from "./src/routes/taskRoutes";

// connect to the database
mongoose.set("strictQuery", false);
mongoConnect();

// Create a new express app instance
const app = express();
// Use Morgan to log the request and response bodies for each request
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// bodyparser
app.use(json());

// routes
app.use("/board", boardRouter);
app.use("/task", taskRouter);

// 404 route
app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

// Start the server
app.listen(3000, function () {
	console.log("App is listening on port 3000!");
});

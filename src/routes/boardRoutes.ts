import { Router } from "express";
import { body } from "express-validator";
//
import { validateRequest } from "../middleware/validate-request";
// controllers
import { createBoard, deleteBoard, getBoards, updateBoard } from "../controllers/boardControllers";

const router = Router();

router

	.post(
		"/create-board",
		[body("name").not().isEmpty().withMessage("Name is required")],
		[body("columns").isArray().withMessage("Must be an array!!")],
		validateRequest,
		createBoard
	)
	.patch(
		"/update-board",
		[body("name").not().isEmpty().withMessage("Name is required")],
		[body("columns").isArray().withMessage("Must be an array!").notEmpty().withMessage("Columns must not be empty")],
		validateRequest,
		updateBoard
	)
	.get("/get-boards", getBoards)
	.delete("/delete-board", deleteBoard);

export { router as boardRouter };

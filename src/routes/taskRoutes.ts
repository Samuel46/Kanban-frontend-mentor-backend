import { Router } from "express";
import { body } from "express-validator";
//
import { validateRequest } from "../middleware/validate-request";
import { createTask, deleteTask, getTaskByColumnId, getTasks, updateSubTask, updateTask } from "../controllers/taskControllers";

const router = Router();

router
	.post(
		"/create-task",
		[body("title").not().isEmpty().withMessage("Title is required")],
		[body("description").not().isEmpty().withMessage("Description is required")],
		[body("status").not().isEmpty().withMessage("Status is required")],
		[body("subtasks").isArray().withMessage("Must be an array!!")],
		validateRequest,
		createTask
	)
	.get("/get-tasks", getTasks)
	.patch("/update-task", updateTask)
	.patch("/update-subtask", updateSubTask)
	.delete("/delete-task/:id", deleteTask);

export { router as taskRouter };

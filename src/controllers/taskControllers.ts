import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request.error";
import { Board } from "../models/Board";
import { Task } from "../models/Task";
/**
 * Route: /create-task
 * Description: API route that creates a  kanban task
 * Method: POST
 * Access: Private
 * */

export const createTask = async (req: Request, res: Response) => {
	const { title, description, subtasks, status } = req.body;

	// check for duplicate titles
	const duplicate = await Task.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec();

	if (duplicate) {
		throw new BadRequestError("Task title taken, try again!");
	}

	const task = await Task.create({ title, description, subtasks, status });

	if (task) {
		// Created
		return res.status(201).send(task);
	} else {
		return res.status(400).json({ message: "Invalid task data received" });
	}
};

/**
 * Route: /get-tasks
 * Description: API route that gets a  kanban tasks
 * Method: GET
 * Access: Private
 * */

export const getTasks = async (req: Request, res: Response) => {
	const boards = await Task.find().lean();
	// Handle error if there are no board in the db
	if (!boards) {
		throw new BadRequestError("No tasks found!");
	}
	// return the boards
	res.status(200).send(boards);
};

/**
 * Route: /get-tasks by status
 * Description: API route that gets a  kanban tasks by columnId
 * Method: GET
 * Access: Private
 * */

export const getTaskByColumnId = async (req: Request, res: Response) => {
	const { columnId } = req.params;

	if (!columnId) {
		throw new BadRequestError("Status fiels is required!!!!");
	}
	const boards = await Task.find({ columnId }).lean();
	// Handle error if there are no board in the db
	if (!boards) {
		throw new BadRequestError("No tasks found!");
	}
	// return the boards
	res.status(200).send(boards);
};

/**
 * Route: /update-task
 * Description: API route that updates a  kanban task
 * Method: Patch
 * Access: Private
 * */

export const updateTask = async (req: Request, res: Response) => {
	const { title, description, subtasks, status, id } = req.body;

	// Confirm task exists to update
	const task = await Task.findById(id).exec();

	if (!task) {
		throw new BadRequestError("Task not found!!");
	}

	// Check for duplicate title
	const duplicate = await Task.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec();

	// Allow renaming of the original task
	if (duplicate && duplicate?._id.toString() !== id) {
		throw new BadRequestError("Duplicate task name");
	}

	task.title = title;
	task.description = description;
	task.subtasks = subtasks;
	task.status = status;

	const updatedBoard = await task.save();

	res.status(200).send(updatedBoard);
};

/**
 * Route: /update-subtask
 * Description: API route that updates a  kanban subTask
 * Method: Patch
 * Access: Private
 * */

type Props = {
	complete: boolean;
	title?: string | undefined;
};

interface SubTask extends Props {
	_id: string;
}

export const updateSubTask = async (req: Request, res: Response) => {
	const { subTaskId, taskId, status } = req.body;

	// Confirm task exists to update
	const task = await Task.findById(taskId).exec();

	if (!task) {
		throw new BadRequestError("Task not found!!");
	}

	// find the subtask to update using the subTaskId
	const subTask = task.subtasks.find((subtask: SubTask | any) => subtask._id.toString() === subTaskId);

	if (!subTask) {
		throw new BadRequestError("Subtask not found!!");
	}

	// update the subtask
	subTask.complete = status;

	const updatedSubTask = await task.save();

	res.status(200).send(updatedSubTask);
};

/**
 * Route: /delete-task
 * Description: API route that delete a  kanban task
 * Method: DELETE
 * Access: Private
 * */

type DeleteResults = {
	title: string;
	_id: string;
};
export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;

	// confirm data
	if (!id) {
		throw new BadRequestError("Task id is required!!");
	}

	// get board
	const task = await Task.findById(id).exec();

	if (!task) {
		throw new BadRequestError("Task does not exist!!");
	}
	// detele
	const result: DeleteResults = await task.deleteOne();

	const reply = `Task ${result.title} with id ${result._id} deleted successfully!!!`;

	res.json({ message: reply });
};

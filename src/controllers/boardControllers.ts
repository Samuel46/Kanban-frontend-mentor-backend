import { Response, Request } from "express";
//
import { Board } from "../models/Board";
import { BadRequestError } from "../errors/bad-request.error";

/**
 * Route: /create-board
 * Description: API route that creates a  kanban board
 * Method: POST
 * Access: Private
 * */
export const createBoard = async (req: Request, res: Response) => {
	const { name, columns } = req.body;
	// check for dubs
	const existingBoard = await Board.findOne({
		name,
	});

	if (existingBoard) {
		throw new BadRequestError("Board name in use");
	}

	// create a new board
	const board = new Board({
		name,
		columns,
	});

	await board.save();
	// save the new board
	res.status(201).send(board);
};

/**
 * Route: /get-boards
 * Description: API route that gets a  kanban boards
 * Method: GET
 * Access: Private
 * */
export const getBoards = async (req: Request, res: Response) => {
	const boards = await Board.find().lean();

	// Handle error if there are no board in the db
	if (!boards) {
		throw new BadRequestError("No boards found!");
	}
	// return the boards
	res.status(200).send(boards);
};

/**
 * Route: /delete-board
 * Description: API route that delete a  kanban board
 * Method: DELETE
 * Access: Private
 * */

type DeleteResults = {
	name: string;
	_id: string;
};
export const deleteBoard = async (req: Request, res: Response) => {
	const { id } = req.body;

	// confirm data
	if (!id) {
		throw new BadRequestError("Board id is required!!");
	}

	// get board
	const board = await Board.findById(id).exec();

	if (!board) {
		throw new BadRequestError("Board does not exist!!");
	}
	// detele
	const result: DeleteResults = await board.deleteOne();

	const reply = `Board ${result.name} with id ${result._id} deleted successfully!!!`;

	res.json({ message: reply });
};

/**
 * Route: /update-board
 * Description: API route that updates a  kanban board
 * Method: Patch
 * Access: Private
 * */

export const updateBoard = async (req: Request, res: Response) => {
	const { name, colunms, id } = req.body;

	// Confirm board exists to update
	const board = await Board.findById(id).exec();

	if (!board) {
		throw new BadRequestError("Board not found!!");
	}

	// Check for duplicate title
	const duplicate = await Board.findOne({ name }).collation({ locale: "en", strength: 2 }).lean().exec();

	// Allow renaming of the original board
	if (duplicate && duplicate?._id.toString() !== id) {
		throw new BadRequestError("Duplicate board name");
	}

	board.name = name;
	board.columns = colunms;

	const updatedBoard = await board.save();

	res.json({ message: `${updatedBoard.name} updated successfully!!!` });
};

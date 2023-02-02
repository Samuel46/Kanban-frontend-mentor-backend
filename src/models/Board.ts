import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		columns: [
			{
				name: {
					type: String,
					required: true,
				},
				prioritize: {
					type: String,
					default: "low",
				},

				tasksIds: [],
			},
		],
	},
	{
		timestamps: true,
	}
);

const Board = mongoose.model("Board", boardSchema);

export { Board };

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		subtasks: [
			{
				title: {
					type: String,
				},
				complete: {
					type: Boolean,
					default: false,
				},
			},
		],

		status: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model("Task", taskSchema);

export { Task };

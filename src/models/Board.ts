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
			},
		],
		delete: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// sort on the asending order
boardSchema.pre("find", async function (done) {
	this.sort({ name: -1, createAt: -1 });
	done();
});

const Board = mongoose.model("Board", boardSchema);

export { Board };

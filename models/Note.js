const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const noteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			require: true,
			ref: "User",
		},
		title: {
			type: String,
			require: true,
		},
		text: {
			type: String,
			required: true,
		},
		completed: {
			type: Booleam,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// This will create a ticket field inside out noteSchema which will give sequential no.
// This will create a separate collection named counter which tracks the sequential no. & insert it into our Notes
noteSchema.plugin(AutoIncrement, {
	inc_field: "ticket",
	id: "ticketNums",
	start_seq: 500,
});

/* This is a note Schmea file or bluePrint of a notes
# Note have four properties - user, title, text, completed
-> user - This property will assign the note to specific user only
                - type - ObjectID of a Schema or Model
                - ref - It refers to which Model or Schema. this will create a relation b/w Note and User Schema

-> Completed - This will store the status of Note is it completed or not.

# Note have one Option,
-> Timestamp -> This will store the created timestamps provided by mongoDB
*/

module.exports = mongoose.model("Note", noteSchema);

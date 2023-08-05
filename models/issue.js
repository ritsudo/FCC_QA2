const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
	project: {
		type: String,
		default: "project"
	},
	assigned_to: {
		type: String,
		default: ""
	},
	status_text: {
		type: String,
		default: ""},
	open: Boolean,
	issue_title: {
		type: String,
		required: true
		},
	issue_text: {
		type: String,
		required: true
		},
	created_by: {
		type: String,
		required: true
		},
	created_on: {
		type: Date,
		default: Date.now
	},
	updated_on: {
		type: Date,
		default: Date.now
	}
});

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;
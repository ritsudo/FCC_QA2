const Issue = require("../models/issue");

const postQuery = (req, res) => {
	
	if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
		res.json({error: "required field(s) missing"});
	} else {
	
	let newIssueJson = {
		project: req.params.project,
		assigned_to: req.body.assigned_to,
		status_text: req.body.status_text,
		open: true,
		issue_title: req.body.issue_title,
		issue_text: req.body.issue_text,
		created_by: req.body.created_by
	}
	
	let newIssue = new Issue(newIssueJson);
	newIssue
		.save()
		.then(res.json({
			project: newIssue.project,
			assigned_to: newIssue.assigned_to,
			status_text: newIssue.status_text,
			open: newIssue.open,
			_id: newIssue._id,
			issue_title: newIssue.issue_title,
			issue_text: newIssue.issue_text,
			created_by: newIssue.created_by,
			created_on: newIssue.created_on,
			updated_on: newIssue.updated_on
		}))
		.catch((err) => console.log(err));

	}
}; 

const putQuery = (req, res) => {
	
	let inpLength = Object.keys(req.body).length;
	
	if (inpLength == 1) {
		if(req.body._id) {
			res.json({error: "no update field(s) sent", _id: req.body._id});
		} else {
			res.json({error: "missing _id"});
		}
	} else {
	
	let _id = req.body._id;
	
	if (!_id) {
		res.json({error: "missing _id"});
	} else {
	
	Issue.findById(_id)
		.then((result) => {
			if (!result) {
				res.json({error: "could not update", _id: req.body._id});
			} else {
				
				if(req.body.assigned_to) {
					result.assigned_to = req.body.assigned_to;
				}
				if(req.body.status_text) {
					result.status_text = req.body.status_text;
				}
				if (req.body.open == "false") {
					result.open = false;
				}
				if(req.body.issue_title) {
					result.issue_title = req.body.issue_title;
				}
				if(req.body.issue_text) {
					result.issue_text = req.body.issue_text;
				}
				if(req.body.created_by) {
					result.created_by = req.body.created_by;
				}
				result.updated_on = Date.now();
				
				result.save()
					.then(res.json({
						result: "successfully updated",
						_id: result._id
					}))
					.catch((err) => console.log(err));
				
			}
		})
		.catch((err) => console.log(err));
		
	}
	
	}
};

const deleteQuery = (req, res) => {
	let _id = req.body._id;
	
	if (!_id) {
		res.json({error: "missing _id"});
	} else {
		
		Issue.findById(_id)
		.then((result) => {
			if (!result) {
				res.json({error: "could not delete", _id: req.body._id});
			} else {
				Issue.findByIdAndRemove(_id)
					.then(res.json({
						result: "successfully deleted",
						_id: result._id
					}))
					.catch((err) => console.log(err));
				
			}
		})
		.catch((err) => console.log(err));
		
	}
};

const getQuery = (req, res) => {
	
	let searchParam = req.query;
	searchParam.project = req.params.project;
	
	Issue.find(searchParam, null, null)
		.then((issues) => {
			let issuesArr = []
			let issueCounter = 0;
			
			issues.forEach(function(issue) {
				issuesArr[issueCounter] = {
					assigned_to: issue.assigned_to,
					status_text: issue.status_text,
					open: issue.open,
					_id: issue._id,
					issue_title: issue.issue_title,
					issue_text: issue.issue_text,
					created_by: issue.created_by,
					created_on: issue.created_on,
					updated_on: issue.updated_on,
				}
				issueCounter += 1;
			});
			
			res.send(issuesArr);
		})
		.catch((err) => console.log(err));
};

module.exports = {
	postQuery,
	putQuery,
	deleteQuery,
	getQuery
};
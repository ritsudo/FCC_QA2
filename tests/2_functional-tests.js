const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	
	let testId, testId2 = 0;
	
	suite("Create tests", function() {
		test("Create an issue with every field: POST request", function (done) {
			chai
				.request(server)
				.post("/api/issues/funcTestProject")
				.send({
					issue_title: "TestTitle",
					issue_text: "TestText",
					created_by: "Tester",
					assigned_to: "Testing",
					status_text: "Tested"
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.issue_title, "TestTitle");
					assert.equal(res.body.issue_text, "TestText");
					assert.equal(res.body.created_by, "Tester");
					assert.equal(res.body.open, true);
					assert.equal(res.body.assigned_to, "Testing");
					assert.equal(res.body.status_text, "Tested");
					assert.isNotNull(res.body._id);
					if(res.body._id) {
						testId = res.body._id;
					}
					assert.isNotNull(res.body.created_on);
					assert.isNotNull(res.body.updated_on);
					done();
				});
		});
		
		
		test("Create an issue with only required fields: POST request", function (done) {
			chai
				.request(server)
				.post("/api/issues/funcTestProject")
				.send({
					issue_title: "TestTitle2",
					issue_text: "TestText2",
					created_by: "Tester",
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.issue_title, "TestTitle2");
					assert.equal(res.body.issue_text, "TestText2");
					assert.equal(res.body.created_by, "Tester");
					assert.equal(res.body.open, true);
					assert.equal(res.body.assigned_to, "");
					assert.equal(res.body.status_text, "");
					assert.isNotNull(res.body._id);
					if(res.body._id) {
						testId2 = res.body._id;
					}
					assert.isNotNull(res.body.created_on);
					assert.isNotNull(res.body.updated_on);
					done();
				});
		});
		
		
		test("Create an issue with missing required fields: POST request", function (done) {
			chai
				.request(server)
				.post("/api/issues/funcTestProject")
				.send({
					issue_title: "TestTitle3",
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "required field(s) missing");
					done();
				});
		});
		
		
	});
	suite("Read tests", function() {
		test("View issues on a project: GET request", function (done) {
			chai
				.request(server)
				.get("/api/issues/funcTestProject")
				.end(function (err,res) {
					assert.equal(res.status, 200);
					assert.isNotNull(res.body[0].issue_title);
					assert.isNotNull(res.body[0]._id);
					assert.isNotNull(res.body[1].issue_title);
					assert.isNotNull(res.body[1]._id);
					done();
				});
		});
		
		
		test("View issues on a project with one filter: GET request", function (done) {
			chai
				.request(server)
				.get("/api/issues/funcTestProject?created_by=Tester")
				.end(function (err,res) {
					assert.equal(res.status, 200);
					assert.isNotNull(res.body[0].issue_title);
					assert.isNotNull(res.body[0]._id);
					assert.isNotNull(res.body[1].issue_title);
					assert.isNotNull(res.body[1]._id);
					done();
				});
		});
		
		
		test("View issues on a project with multiple filters: GET request", function (done) {
			chai
				.request(server)
				.get("/api/issues/funcTestProject?created_by=Tester&issue_text=TestText2")
				.end(function (err,res) {
					assert.equal(res.status, 200);
					assert.isNotNull(res.body.issue_title);
					assert.isNotNull(res.body._id);
					done();
				});
		});
	});
	suite("Update tests", function() {
		test("Update one field on an issue: PUT request", function (done) {
			chai
				.request(server)
				.put("/api/issues/funcTestProject")
				.send({
					_id: testId,
					issue_title: "TestTitleUpdated",
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.result, "successfully updated");
					assert.isNotNull(res.body._id);
					done();
				});
		});
		
		test("Update multiple fields on an issue: PUT request", function (done) {
			chai
				.request(server)
				.put("/api/issues/funcTestProject")
				.send({
					_id: testId2,
					issue_title: "TestTitleUpdated",
					issue_text: "TestTextUpdated"
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.result, "successfully updated");
					assert.isNotNull(res.body._id);
					done();
				});
		});
		test("Update an issue with missing _id: PUT request", function (done) {
			chai
				.request(server)
				.put("/api/issues/funcTestProject")
				.send({
					issue_title: "TestTitleUpdated",
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});
		test("Update an issue with no fields to update: PUT request", function (done) {
			chai
				.request(server)
				.put("/api/issues/funcTestProject")
				.send({
					_id: testId2,
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "no update field(s) sent");
					done();
				});
		});
		test("Update an issue with an invalid _id: PUT request", function (done) {
			chai
				.request(server)
				.put("/api/issues/funcTestProject")
				.send({
					_id: "tetor",
					issue_title: "Tester"
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "could not update");
					done();
				});
		});
		
	});
	suite("Delete tests", function() {
		test("Delete an issue: DELETE request", function (done) {
			chai
				.request(server)
				.delete("/api/issues/funcTestProject")
				.send({
					_id: testId
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.result, "successfully deleted");
					assert.isNotNull(res.body._id);
					done();
				});
		});
		test("Delete an issue with an invalid _id: DELETE", function (done) {
			chai
				.request(server)
				.delete("/api/issues/funcTestProject")
				.send({
					_id: "tetor"
				})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "could not delete");
					done();
				});
		});
		test("Delete an issue with missing _id: DELETE", function (done) {
			chai
				.request(server)
				.delete("/api/issues/funcTestProject")
				.send({})
				.end(function(err,res){
					assert.equal(res.status, 200);
					assert.equal(res.body.error, "missing _id");
					done();
				});
		});
		
	});
});

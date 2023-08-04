'use strict';

const {
	postQuery,
	putQuery,
	deleteQuery,
	getQuery
} = require("../controllers/mainController");

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(getQuery)
    .post(postQuery)
    .put(putQuery)
    .delete(deleteQuery);
    
};

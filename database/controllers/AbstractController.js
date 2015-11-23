module.exports = function (model) {

 	this.model = model;

 	this.select = function(jsonKeys, jsonWhere, done) {
 		this.model.select(jsonKeys, jsonWhere, done);
 	};

 	this.insert = function(jsonData, done) {
 		this.model.insert(jsonData, done);
 	};

 	this.update = function(jsonData, jsonIds, done) {
 		this.model.update(jsonData, jsonIds, done);
 	};

 	this.delete = function(jsonIds, done) {
 		this.model.delete(jsonIds, done);
 	};

 };

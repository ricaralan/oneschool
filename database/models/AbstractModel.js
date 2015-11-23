/**
*  AbstractModel.js
*
*  @author Alan Olivares
*  @version 0.0.1
*/

var connection = require("../connection/");
var self;

var AbstractModel = function() {
  self = this;
  self.table = null;
};

AbstractModel.prototype.tableStructure = {};

AbstractModel.prototype.setTable = function(table) {
  self.table = table;
};

AbstractModel.prototype.getConnection = function() {
  return connection;
};

AbstractModel.prototype.getDescriptionTable = function(done) {
  connection.query("describe " + self.table, function (err, attributes) {
    json = {};
    for (pos in attributes) {
      json[attributes[pos].Field] = {type:attributes[pos].Type};
    }
    done(json);
  });
};

AbstractModel.prototype.select = function(jsonKeys, jsonWhere, done) {
  self.getDescriptionTable(function(json){
    self.tableStructure = json;
    try {
      jsonwhere = self.getJsonDataSelect(jsonWhere);
      query = "SELECT " + jsonKeys + " FROM " + self.table;
      if (jsonwhere.arrayValues.length > 0){
        query += " WHERE " + jsonwhere.value;
        connection.query(query, jsonwhere.arrayValues, done);
      } else {
        connection.query(query, done);
      }
    } catch (e) {
      done({message:"A field not found"}, null);
    }
  });
};

AbstractModel.prototype.getJsonDataSelect = function (jsonKeysValues) {
  var value = "", arrayValues = [];
  cont = 0, i = 0;
  for (key in jsonKeysValues) {
    if (cont != 0) {
      value += " AND ";
    }
    value += key + "=?";
    arrayValues[i++] = jsonKeysValues[key];
    cont++;
  }
  return {
    value : value,
    arrayValues : arrayValues
  };
};

AbstractModel.prototype.insert = function (jsonData, done) {
  self.getDescriptionTable(function(json){
    self.tableStructure = json;
    try {
      json = self.getDataJsonInsert(jsonData);
      console.log("INSERT INTO "+self.table+" "+ json.keys +" VALUES " + json.signos);
      connection.query("INSERT INTO "+self.table+" "+ json.keys +" VALUES " + json.signos, json.values, done);
    } catch (e) {
      done({message:"A field not found"}, null);
    }
  });
};

AbstractModel.prototype.update = function (jsonData, jsonIds, done) {
  self.getDescriptionTable(function(json){
    self.tableStructure = json;
    try {
      json  = self.getDataJsonUpdate(jsonData, jsonIds);
      query = "UPDATE " + self.table + json.sets + json.whereids;
      connection.query(query, json.arrays, done);
    } catch (e) {
      done({message:"A field not found"}, null);
    }
  });
};

AbstractModel.prototype.delete = function (jsonIds, done) {
  json = self.getKeyValueJson("AND", jsonIds);
  query = "DELETE FROM " + self.table +  " WHERE "+ json.keys ;
  connection.query(query, json.arrayValues, done);
};

AbstractModel.prototype.getDataJsonUpdate = function (jsonData, jsonIds) {
  sets = " SET ", whereids = " WHERE ";
  cont = 0, i = 0;
  json1 = self.getKeyValueJson(",", jsonData);
  sets += json1.keys;
  json2 = self.getKeyValueJson(" AND ", jsonIds);
  whereids += json2.keys;
  return {
    sets      : sets,
    whereids  : whereids,
    arrays    : getJoinJsons(json1.arrayValues, json2.arrayValues)
  };
};

function getJoinJsons(json1, json2){
	json = [];
	mergeJson(json, json1);
	mergeJson(json, json2);
	return json
}

function mergeJson(jsonTemp, json){
  var i = jsonTemp.length;
	for (key in json){
    jsonTemp[i++] = json[key];
  }
}

AbstractModel.prototype.getKeyValueJson = function (separator, jsonData) {
  keys = "";
  array = [];
  cont = 0, i = 0;
  for (key in jsonData) {
    if (self.existDataType(key)){
      if (cont != 0){
        keys += " " + separator + " ";
      }
      keys +=  key + "=?";
      array[i++] = jsonData[key];
    }
    cont++;
  }
  return {
    keys : keys,
    arrayValues : array
  };
};

AbstractModel.prototype.getDataJsonInsert = function (jsonData) {
  keys = "", signos = "", values = [];
  cont = 0, i = 0;
  for (key in jsonData){
    if (self.existDataType(key)){
      if (cont != 0){
        keys   += ",";
        signos += ",";
      }
      keys += key;
      signos += "?";
      values[i++] =  jsonData[key];
    }
    cont ++;
  }
  return {
    keys   : "(" + keys   + ")",
    signos : "(" + signos + ")",
    values : values
  };
};

AbstractModel.prototype.existDataType = function (key) {
  return self.tableStructure != null;
};

AbstractModel.prototype.getCorrectTypeValue = function (key, value){
  if (self.tableStructure[key].type.indexOf("varchar") != 0 && self.tableStructure[key].type.indexOf("date") != 0) {
    return value;
  }
  return "'"+value+"'";
};

module.exports = new AbstractModel();

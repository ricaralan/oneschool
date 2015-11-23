/**
*  This file return mysql connection
*/
module.exports = function(option) {
  var configDB = require("./config_db"),
      connection = require("mysql").createConnection(configDB[option]);
  return connection;
}

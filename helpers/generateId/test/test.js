/**
*
* @author Alan Olivares
*/
var assert = require("assert"),
    GenerateId = require("../");

g = new GenerateId();

assert.notEqual(g.generate(100), g.generate(100));

console.log("Success test!", g.generate({
  length : 10,
  include : ["upper", "down", "numbers"],
  add : {
    before : "|_- ",
    after : " -_|"
  }
}));

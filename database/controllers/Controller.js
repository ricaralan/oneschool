Controller = function() {

  self = this;

}

Controller.prototype = new (require("./AbstractController"))(new (require("../models/Model"))());

module.exports = Controller;

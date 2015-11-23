/**
*	This module help to cipher and decipher Strings
*
*	@version 1.2.1
*	@author Alan Olivares
*/

module.exports = function() {

	var crypto = require("crypto"),
		configEncriptacion = require("./ConfigEncriptation");

	this.cipher = function(word) {
		try{
			var cipher 	 = crypto.createCipher(
				configEncriptacion.openSSLCipherAlgorithm,
				configEncriptacion.key);
			var wordCipher  = cipher.update(word, "utf8", "hex");
			wordCipher 	  += cipher.final("hex");
		}catch(e){
			console.log("ERROR CIPHER: " + e.message, word);
		}
		return wordCipher;
	};

	this.decipher = function(wordToDecipher) {
		try{
			var decipher = crypto.createDecipher(
				configEncriptacion.openSSLCipherAlgorithm,
				configEncriptacion.key);
			var wordDecipher  = decipher.update(wordToDecipher, "hex", "utf8");
			wordDecipher	 += decipher.final("utf8");
		}catch(e){
			console.log("ERROR DECIPHER: " + e.message, wordToDecipher);
		}
		return wordDecipher;
	};

}

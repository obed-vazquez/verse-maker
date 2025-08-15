/*
 * Module:  		ValidationException.gs
 * Author mail:		obed.vazquez@gmail.com
 * GoogleProyect: 	https://script.google.com/d/14Qrk-vG5uDw_2Cws9NePZEazz8oEEVxHUlAKP_pp4Iut6PrF83YmYOtY/edit
 * License: 		(Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/
 * Legal Code:		(Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/legalcode
 */

/**
 * Validation Project Exception.
 * Use it when throwing Validation errors in your methods.
 * @author Obed Vazquez Lopez
 * @since 08/Apr/2016
 * @ProyectKey MNuj1w5fvwhzODeTTPfEMYnd8W73qGbVI
 */
function ValidationException(message,srcClass,srcMethod,stack){
	this.fileName=srcClass+"." || "";
	this.srcMethod=srcMethod+"()" || "";
	this.stack=stack!==null?"\ncaused by: "+stack.toString():"";
	this.name="ValidationException";
	this.message=message || "Invalid Parameters";
	Error.call();
}

/**
 * Inherits from VerseMakerException javascript class throught .
 * 
 * @author Obed Vazquez Lopez
 * @since 08/Apr/2016
 */
ValidationException.prototype = Object.create(VerseMakerException.prototype);
ValidationException.prototype.constructor = VerseMakerException;












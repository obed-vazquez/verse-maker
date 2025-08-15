/*
 * Module:  		VerseMakerException.gs
 * Author mail:		obed.vazquez@gmail.com
 * GoogleProyect: 	https://script.google.com/d/14Qrk-vG5uDw_2Cws9NePZEazz8oEEVxHUlAKP_pp4Iut6PrF83YmYOtY/edit
 * License: 		(Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/
 * Legal Code:		(Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/legalcode
 */

/**
 * Generic VerseMaker Project Exception.
 * Use it when throwing generic errors in your methods.
 * @author Obed Vazquez Lopez
 * @since 26/01/2016
 * @ProyectKey MNuj1w5fvwhzODeTTPfEMYnd8W73qGbVI
 */
function VerseMakerException(title,message,srcClass,srcMethod,stack){
	this.fileName=srcClass+"." || "";
	this.srcMethod=srcMethod+"()" || "";
	this.stack=stack!==null?"\ncaused by: "+stack.toString():"";
	this.name=title || "UknownException";
	this.message=message || "Imposible to complete the operation";
	Error.call();
}

/**
 * Inherits from Error javascript class throught VerseMakerException.
 * 
 * @author Obed Vazquez Lopez
 * @since 26/01/2016
 */
VerseMakerException.prototype = Object.create(Error.prototype);
VerseMakerException.prototype.constructor = Error;

 /**
 * toString() Overrided method from Object.
 *
 * @author Obed Vazquez Lopez
 * @since 13/12/2014
 * @return {string} Exception detailed description represented by this instance.
 */
VerseMakerException.prototype.toString=function toString(){
	return this.name+" at "+this.fileName+this.srcMethod+": "+
		(this.lineNumber===null || this.lineNumber===0 ?"":this.lineNumber+" - ")+
		this.message+this.stack;
}











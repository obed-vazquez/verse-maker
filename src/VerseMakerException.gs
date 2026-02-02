/*
 * Module:  		VerseMakerException.gs
 * Updated:         Fixed stack trace chaining for GAS V8
 */

/**
 * Generic VerseMaker Project Exception.
 * Use it when throwing generic errors in your methods.
 *
 * @param {string} title
 * @param {string} message
 * @param {string} srcClass
 * @param {string} srcMethod
 * @param {Error}  originalError
 */
function VerseMakerException(title, message, srcClass, srcMethod, originalError) {

  // Call native Error constructor to initialize stack
  Error.call(this, message);

  this.name = title || "UnknownException";
  this.message = message || "Impossible to complete the operation";

  this.fileName = srcClass ? srcClass + "." : "";
  this.srcMethod = srcMethod ? srcMethod + "()" : "";

  // Preserve original stack trace if available
  if (originalError instanceof Error && originalError.stack) {
    this.stack =
      this.name + ": " + this.message +
      "\n    at " + this.fileName + this.srcMethod +
      "\n--- Caused by ---\n" +
      originalError.stack;
  } else {
    // Fallback: keep whatever stack Error() generated
    this.stack = this.stack || "";
  }
}

/**
 * Inherits from native Error
 */
VerseMakerException.prototype = Object.create(Error.prototype);
VerseMakerException.prototype.constructor = VerseMakerException;

/**
 * Overridden toString()
 * @return {string}
 */
VerseMakerException.prototype.toString = function () {
  return this.stack || (
    this.name +
    " at " +
    this.fileName +
    this.srcMethod +
    ": " +
    this.message
  );
};

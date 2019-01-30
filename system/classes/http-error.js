/**
 * HTTP ERROR CLASS
 */
class HttpError extends Error {
  /**
   *
   * @param {Number} httpCode  http error code
   * @param {String} code      error code for translation
   * @param {String} message   error message
   */
  constructor(httpCode, code, message) {
    super(message);
    this.httpCode = httpCode;
    this.code = code;
  }
}

export default HttpError;

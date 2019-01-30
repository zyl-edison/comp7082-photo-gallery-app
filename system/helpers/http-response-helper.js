/**
 * TO HTTP ERROR RESPONSE
 *
 * Convert http error to error response
 *
 * @param  {HttpError} httpError http error
 * @return {Object}              response object
 */
export const toHttpErrorResponse = (httpError) => {
  return {
    success: false,
    error: {
      message: httpError.message,
      code: httpError.code,
    },
  };
};

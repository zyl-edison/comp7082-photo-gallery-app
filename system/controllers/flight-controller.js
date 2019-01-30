import request from 'request';
import queryString from 'query-string';
import Controller from './controller';
import {HttpError} from '../classes';
import {
  httpResponse as httpResponseHelper,
  validation as validationHelper,
} from '../helpers';

/**
 * FLIGHT CONTROLLER CLASS
 */
class FlightController extends Controller {
  /**
   * CONSTRUCTOR
   */
  constructor() {
    super();
    // TODO: We can read the followings in the config.yml file. Skip this
    //       part for now
    this.apiDomain = 'https://api.sandbox.amadeus.com';
    this.apiVersion = 'v1.2';
    this.apiName = 'flights';
    this.apikey = 'OdsQzhUKnybwtK6XHH75Uo8p2eY2QI2Y';
  }
  /**
   * ACQUIRE LOW FARE ACTION
   *
   * Get top 3 cheapest flight from a origin to destination
   *
   * @param  {Object}  config config object
   * @return {Function}       a middleware function
   */
  acquireLowFare() {
    const apiActionName = 'low-fare-search';
    const {date: {isYearMonthDay}} = validationHelper;
    const {apiDomain, apiVersion, apiName, apikey} = this;

    return (req, res) => {
      const {query: {origin, destination, departure_date: departureDate}} = req;

      (async () => {
        try {
          if (!origin && !destination && !departureDate) {
            throw new HttpError(
              400,
              'ORIGIN_DEST_DATE_REQUIRED',
              'origin, destination and departure date are required'
            );
          } else if (!isYearMonthDay(departureDate)) {
            throw new HttpError(
              400,
              'INVALID_DATE_FORMAT',
              'Departure date is not in YYYY-MM-DD format'
            );
          }
          let requestUrl = [apiDomain, apiVersion, apiName, apiActionName]
            .join('/');
          requestUrl = requestUrl + '?' + queryString.stringify({
            apikey,
            origin,
            destination,
            departure_date: departureDate,
          });


          const cheapestFlights = await new Promise((resolve, reject) => {
            request(requestUrl, (error, response, body) => {
              if (error) {
                reject(new HttpError(500, 'REQUEST_ERROR', 'Request fail'));
              } else {
                const {status, message, results} = JSON.parse(body);

                if (response.statusCode !== 200) {
                  reject(
                    new HttpError(status, 'REQUEST_RESPONSE_ERROR', message)
                  );
                } else {
                  resolve(results);
                }
              }
            });
          });

          res.status(200).send(cheapestFlights.slice(0, 3));
        } catch (httpError) {
          res.status(httpError.httpCode).send(
            httpResponseHelper.toHttpErrorResponse(httpError)
          );
        }
      })();
    };
  }
}

// export a singleton object
export default new FlightController();

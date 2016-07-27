'use strict'

const ExceptionParser = use('App/Services/ExceptionParser')
const Http = exports = module.exports = {}

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  ExceptionParser.send(error, request, response)
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
}

'use strict'

/*
|--------------------------------------------------------------------------
| Custom Exceptions
|--------------------------------------------------------------------------
|
| Entire flow is defined to throw Exceptions and exception parser can be
| used to handle exceptions gracefully and make them consumable to the
| end user.
|
*/

const NE = use('node-exceptions')

class ApplicationException extends NE.LogicalException {}

class ValidationException extends NE.LogicalException {
  static failed (fields) {
    const instance = new this('Validation failed', 400)
    instance.fields = fields
    return instance
  }
}

module.exports = {ApplicationException, ValidationException}

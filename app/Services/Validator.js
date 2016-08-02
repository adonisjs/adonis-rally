'use strict'

const AdonisValidator = use('Validator')
const Exceptions = use('App/Exceptions')
const Validator = exports = module.exports = {}

/**
 * validator specific method used to extend adonis validator
 * and validate an input to be a possible numeric value.
 *
 * @param  {Object} data
 * @param  {String} field
 * @param  {String} message
 * @param  {Array} [args]
 * @param  {Function} get
 *
 * @return {Promise}
 */
function validateNumeric (data, field, message, args, get) {
  return new Promise((resolve, reject) => {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return resolve('Skipping validation')
    }
    if (!isNaN(parseFloat(fieldValue)) && isFinite(fieldValue)) {
      return resolve('Validation passed')
    }
    console.log(message)
    reject(message)
  })
}

/**
 * validates input using adonis validator and throws
 * an exception by attaching validation messages
 * to the fields.
 *
 * @param {Object} data
 * @param {Object} rules
 * @param {Object} messages
 *
 * @public
 */
Validator.validate = function * (data, rules, messages) {
  const validation = yield AdonisValidator.validate(data, rules, messages)
  if (validation.fails()) {
    throw Exceptions.ValidationException.failed(validation.messages())
  }
}

/**
 * extends adonis validator by adding numeric rule
 * to it.
 *
 * Feel free to add your own custom rules here.
 */
Validator.extendValidator = function () {
  AdonisValidator.extend('numeric', validateNumeric, 'Numeric validation failed on {{field}}')
}

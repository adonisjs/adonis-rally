'use strict'

const Validator = use('Validator')
const Exceptions = use('App/Exceptions')
const Validation = exports = module.exports = {}

Validation.validate = function * (data, rules, messages) {
  const validation = yield Validator.validate(data, rules, messages)
  if (validation.fails()) {
    throw Exceptions.ValidationException.failed(validation.messages())
  }
}

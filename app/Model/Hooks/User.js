'use strict'

const Hash = use('Hash')
const uuid = use('node-uuid')
const User = exports = module.exports = {}

/**
 * encrypts user password before saving the
 * user.
 *
 * @param {Function} next
 *
 * @yield {Function}
 */
User.encryptPassword = function * (next) {
  this.password = yield Hash.make(this.password)
  yield next
}

/**
 * sets verification token for a newly created
 * user.
 *
 * @param {Function} next
 *
 * @yield {Function}
 */
User.setVerificationToken = function * (next) {
  this.verification_code = uuid.v1()
  yield next
}

'use strict'

const Mailer = use('App/Services/Mailer')
const Mail = exports = module.exports = {}

/**
 * sends email using the mailer service
 * upon new user registeration.
 *
 * @param {Object} user
 */
Mail.sendVerificationEmail = function * (user) {
  yield Mailer.sendVerificationEmail(user)
}

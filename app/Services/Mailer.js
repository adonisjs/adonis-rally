'use strict'

const Mail = use('Mail')
const Env = use('Env')

const Mailer = exports = module.exports = {}

/**
 * sends verification email to a given user by
 * using the default mail driver
 *
 * @param {Object} user
 *
 * @yield {Object}
 *
 * @public
 */
Mailer.sendVerificationEmail = function * (user) {
  if (!user || typeof (user.toJSON) !== 'function') {
    throw new Error('Mailer expects a valid instance of User Model.')
  }
  return yield Mail.send('emails.userVerification', user.toJSON(), (message) => {
    message.to(user.email, user.name)
    message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
    message.subject('Verify AdonisJs Rally Account Email Address')
  })
}

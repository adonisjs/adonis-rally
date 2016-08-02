'use strict'

const User = use('App/Model/User')
const Validator = use('App/Services/Validator')
const Mailer = use('App/Services/Mailer')
const UserRepository = make('App/Repositories/User')

class UsersController {

  /**
   * return user jwt token by validating
   * their credentials
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * login (request, response) {
    const credentials = request.only('email', 'password')
    yield Validator.validate(credentials, User.loginRules, User.loginMessages)

    const user = yield UserRepository.findViaCredentials(credentials.email, credentials.password)
    const loginToken = yield request.auth.generate(user)
    response.ok({message: 'Logged in successfully', token: loginToken, status: 200})
  }

  /**
   * Registers a user by creating a new user and
   * sending them email verification email.
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * register (request, response) {
    const userDetails = request.only('email', 'password')
    yield Validator.validate(userDetails, User.newUserRules, User.newUserMessages)
    const user = yield UserRepository.register(userDetails.email, userDetails.password)
    response.ok({message: 'Account created successfully', status: 200, data: user})
  }

  /**
   * verifies a user account with a give
   * token
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * verifyAccount (request, response) {
    const token = request.input('token')
    const user = yield UserRepository.findByOrFail('verification_code', token)
    user.status = 'active'
    const updateUser = yield user.save()

    if (!updateUser) {
      response.badRequest({message: 'We are unable to upate your account status', status: 400})
      return
    }
    response.ok({message: 'Account verified successfully', status: 200})
  }

  /**
   * re-sends verification token to the users
   * email address.
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * sendVerificationEmail (request, response) {
    const emailResponse = yield Mailer.sendVerificationEmail(request.authUser)

    if (!emailResponse || emailResponse.accepted instanceof Array === false || !emailResponse.accepted.length) {
      response.badRequest({message: 'Unable to deliver email to given email address', status: 400})
      return
    }
    response.ok({message: 'Email sent successfully', status: 200})
  }
}

module.exports = UsersController

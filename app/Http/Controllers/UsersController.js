'use strict'

const User = use('App/Model/User')
const Validation = use('App/Services/Validation')
const Event = use('Event')
const Hash = use('Hash')

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
    yield Validation.validate(credentials, User.loginRules, User.loginMessages)

    const user = yield User.findBy('email', credentials.email)
    if (!user) {
      response.badRequest({error: 'Unable to find any account with this email address', status: 400})
      return
    }

    const isMatchedPassword = Hash.verify(credentials.password, user.password)
    if (!isMatchedPassword) {
      response.badRequest({error: 'Password mis-match', status: 400})
      return
    }

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
    yield Validation.validate(userDetails, User.newUserRules, User.newUserMessages)
    const savedUser = yield User.create(userDetails)

    /**
     * isNew() will return true when unable to persist data
     */
    if (savedUser.isNew()) {
      return response.badRequest({error: 'Unable to create your account, please try after some time', status: 400})
    }

    const fetchSavedUser = yield User.find(savedUser.id) // lucid will have .refresh method soon
    Event.fire('user:registered', fetchSavedUser) // firing email event in a non-blocking fashion

    response.ok({message: 'Account created successfully', status: 200, data: fetchSavedUser})
  }

}

module.exports = UsersController

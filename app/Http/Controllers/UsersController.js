'use strict'

const User = use('App/Model/User')
const Validation = use('App/Services/Validation')
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
      response.badRequest({error: 'Unable to find any account with this email address'})
      return
    }

    const isMatchedPassword = Hash.verify(credentials.password, user.password)
    if (!isMatchedPassword) {
      response.badRequest({error: 'Password mis-match'})
      return
    }

    const loginToken = yield request.auth.generate(user)
    response.ok({message: 'Logged in successfully', token: loginToken})
  }

}

module.exports = UsersController

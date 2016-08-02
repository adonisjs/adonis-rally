'use strict'

const Exceptions = use('App/Exceptions')
const Event = use('Event')
const Hash = use('Hash')

class UserRepository {

  /**
   * injecting required dependencies auto fulfilled
   * by IoC container
   *
   * @return {Array}
   */
  static get inject () {
    return ['App/Model/User']
  }

  constructor (User) {
    this.User = User
  }

  /**
   * registers a new user with email address
   * and password.
   *
   * @param  {String} email
   * @param  {String} password
   *
   * @return {Object}
   *
   * @throws {ApplicationException} If unable to create a new user
   *
   * @public
   */
  * register (email, password) {
    const user = new this.User()
    user.email = email
    user.password = password
    yield user.save()

    if (user.isNew()) {
      throw new Exceptions.ApplicationException('Unable to create your account, please try after some time', 400)
    }
    const freshInstance = yield this.User.find(user.id)
    Event.fire('user:registered', freshInstance) // firing email event in a non-blocking fashion
    return freshInstance
  }

  /**
   * finds a user with a given field and value.
   *
   * @param  {String} verificationCode
   *
   * @return {Object}
   *
   * @throws {ApplicationException} If unable to find user with verification code
   *
   * @public
   */
  * findByOrFail (field, value, callback) {
    const user = yield this.User.findBy(field, value)
    if (!user) {
      if (typeof (callback) === 'function') {
        callback()
        return
      }
      throw new Exceptions.ApplicationException(`Cannot find user with ${field}`, 404)
    }
    return user
  }

  /**
   * finds a user using email and password
   *
   * @param  {String} email
   * @param  {String} password
   *
   * @throws {ApplicationException} If Unable to find user with email address
   * @throws {ApplicationException} If Cannot verify user password
   *
   * @return {Object}
   */
  * findViaCredentials (email, password) {
    const user = yield this.findByOrFail('email', email, function () {
      throw new Exceptions.ApplicationException('Unable to find any account with this email address', 400)
    })
    const isMatchedPassword = yield Hash.verify(password, user.password)
    if (!isMatchedPassword) {
      throw new Exceptions.ApplicationException('Password mis-match', 400)
    }
    return user
  }

}

module.exports = UserRepository

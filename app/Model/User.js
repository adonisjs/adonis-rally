'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  /**
   * fields to hide when fetch rows
   *
   * @return {Array}
   */
  static get hidden () {
    return ['password']
  }

  /**
   * implementing boot method to add hooks to
   * the model
   */
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword')
  }

  /**
   * rules to be used when validating user credentials
   * for login
   *
   * @return {Object}
   */
  static get loginRules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  /**
   * login validation messages
   *
   * @return {Object}
   */
  static get loginMessages () {
    return {
      'email.required': 'Email is required to login to your account',
      'email.email': 'Enter a valid email address to login to your account',
      'password.required': 'Enter your account password'
    }
  }

}

module.exports = User

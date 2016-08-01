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
    this.addHook('beforeCreate', 'User.setVerificationToken')
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

  /**
   * rules to be used when creating a new account
   * for a user.
   *
   * @return {Object}
   */
  static get newUserRules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  /**
   * messages to be printed when validation fails
   * for user registeration.
   *
   * @return {Object}
   */
  static get newUserMessages () {
    return {
      'email.required': 'Enter email address to be used for login',
      'email.email': 'Email address is not valid',
      'email.unique': 'There\'s already an account with this email address',
      'password.required': 'Choose password for your account'
    }
  }

}

module.exports = User

'use strict'

const chai = require('chai')
const assert = chai.assert
const Mailer = use('App/Services/Mailer')
const Config = use('Config')
const Env = use('Env')
const emailParser = require('../parsers/email')
require('co-mocha')

describe('Mailer', function () {
  it('should throw an error when instance of user model is not passed', function * () {
    try {
      yield Mailer.sendVerificationEmail({})
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Mailer expects a valid instance of User Model.')
    }
  })

  it('should send an email to a given user', function * () {
    /**
     * A weird but working stub
     */
    const user = {
      email: 'foo@bar.com',
      name: 'foo',
      toJSON: function () {
        return {email: this.email, verification_token: 1210201020}
      }
    }
    const emailResponse = yield Mailer.sendVerificationEmail(user)
    assert.deepEqual(emailResponse.accepted, ['foo <foo@bar.com>'])
    assert.deepEqual(emailResponse.rejected, [])
    const email = yield emailParser.getEmail(Config.get('mail.log.toPath'), 'recent')
    assert.deepEqual(email.to, [{address: 'foo@bar.com', name: 'foo'}])
    assert.deepEqual(email.from, [{address: Env.get('MAIL_FROM_EMAIL'), name: Env.get('MAIL_FROM_NAME')}])
    assert.match(email.htmlBody, /You have used foo@bar.com when signing up/)
    assert.match(email.htmlBody, /<a\s*href=\s*".*?token=1210201020\s*">/)
  })
})

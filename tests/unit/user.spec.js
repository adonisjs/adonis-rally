'use strict'

const chai = use('chai')
const assert = chai.assert
const userRepository = make('App/Repositories/User')
const User = use('App/Model/User')
require('co-mocha')

describe('User', function () {
  it('show be able to register a new user using email and password', function * () {
    const Event = use('Event')
    let eventFired = false
    Event.removeListeners('user:registered') // removing app listeners during test
    Event.on('user:registered', function * () {
      eventFired = true
    })
    const user = yield userRepository.register('foo@bar.com', 'secret')
    assert.instanceOf(user, User)
    assert.equal(user.status, 'pending-verification')
    assert.match(user.verification_code, /[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}/)
    assert.equal(eventFired, true)
  })

  it('show throw error when unable to find user with verification code', function * () {
    try {
      yield userRepository.findByOrFail('verification_code', 1200200301)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.name, 'ApplicationException')
      assert.equal(e.message, 'Cannot find user with verification_code')
    }
  })

  it('show return user model instance when able to find a user with verification code', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const fetchUser = yield userRepository.findByOrFail('verification_code', user.verification_code)
    assert.equal(fetchUser.id, user.id)
  })

  it('show throw an exception when unable to find a user account using credentials', function * () {
    try {
      yield userRepository.findViaCredentials('foo', 'secret')
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Unable to find any account with this email address')
    }
  })

  it('show throw an exception when unable to verify user password', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    try {
      yield userRepository.findViaCredentials(user.email, 'secret')
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Password mis-match')
    }
  })

  it('show return user model instance when credentials are correct', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const fetchedUser = yield userRepository.findViaCredentials(user.email, user.password)
    assert.instanceOf(fetchedUser, User)
    assert.equal(user.id, fetchedUser.id)
  })
})

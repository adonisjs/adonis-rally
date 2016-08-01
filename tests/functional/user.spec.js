'use strict'

const chai = require('chai')
const request = require('supertest')
const assert = chai.assert
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
require('co-mocha')

describe('User', function () {
  afterEach(function * () {
    const Db = use('Database')
    yield Db.truncate('users')
  })

  it('should throw validation error when user email is missing', function * () {
    const response = yield request(baseUrl)
      .post('register')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.equal(response.body.status, 400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'email', 'validation': 'required', message: 'Enter email address to be used for login'}])
  })

  it('should throw validation error when user email is invalid', function * () {
    const response = yield request(baseUrl)
      .post('register')
      .send({email: 'foo'})
      .expect('Content-Type', /json/)
      .expect(400)

    assert.equal(response.body.status, 400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'email', 'validation': 'email', message: 'Email address is not valid'}])
  })

  it('should throw validation error when user password is missing', function * () {
    const response = yield request(baseUrl)
      .post('register')
      .send({email: 'newuser@adonisjs.com'})
      .expect('Content-Type', /json/)
      .expect(400)

    assert.equal(response.body.status, 400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'password', 'validation': 'required', message: 'Choose password for your account'}])
  })

  it('should throw validation error when user email address has already been taken', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const response = yield request(baseUrl)
      .post('register')
      .send({email: user.email, password: 'secret'})
      .expect('Content-Type', /json/)
      .expect(400)

    assert.equal(response.body.status, 400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'email', 'validation': 'unique', message: 'There\'s already an account with this email address'}])
  })

  it('should register a user and send registeration email', function * () {
    const Event = use('Event')
    let eventFired = false
    Event.removeListeners('user:registered') // removing app listeners during test
    Event.on('user:registered', function * () {
      eventFired = true
    })

    const response = yield request(baseUrl)
      .post('register')
      .send({email: 'newuser@adonisjs.com', password: 'secret'})
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.status, 200)
    assert.equal(response.body.message, 'Account created successfully')
    assert.equal(response.body.data.status, 'pending-verification')
    assert.match(response.body.data.verification_code, /[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}/)
    assert.equal(eventFired, true)
  })
})

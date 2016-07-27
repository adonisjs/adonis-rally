'use strict'

const chai = require('chai')
const request = require('supertest')
const assert = chai.assert
const co = require('co')
const Ioc = require('adonis-fold').Ioc
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
const apiUrl = `${baseUrl}api/v1/`
require('co-mocha')

function * getJwtToken (user) {
  const AuthManager = use('Adonis/Src/AuthManager')
  const authManager = new AuthManager(use('Adonis/Src/Config'), {})
  return yield authManager.generate(user)
}

const oldEnd = request.Test.prototype.end
request.Test.prototype.login = function (user, authenticator) {
  this.adonisUser = user
  return this
}

request.Test.prototype.end = function () {
  const self = this
  const args = arguments
  if (this.adonisUser) {
    return co(function * () {
      const token = yield getJwtToken(self.adonisUser)
      self.set('Authorization', `Bearer ${token}`)
      return oldEnd.apply(self, args)
    })
  }
  return oldEnd.apply(this, args)
}

describe('Question', function () {
  before(function * () {
    Ioc.bind('Adonis/Src/Hash', function () {
      return {
        make: function * (value) {
          return value
        },
        verify: function * (value, compare) {
          return value === compare
        }
      }
    })
    yield use('App/Model/User').create({email: 'foo@bar.com', password: 'secret'})
  })

  after(function * () {
    const Db = use('Database')
    yield Db.truncate('users')
  })

  afterEach(function * () {
    const Db = use('Database')
    yield Db.truncate('questions')
    yield Db.truncate('channels')
  })

  it('should get a 200 when making request to fetch all questions', function (done) {
    request(apiUrl)
      .get('questions.json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('should return an empty array when there are no questions', function * () {
    const response = yield request(apiUrl)
      .get('questions.json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.deepEqual(response.body.data, [])
  })

  it('should return the questions when they exists', function * () {
    yield use('App/Model/Question').create({title: 'Adonis 101', body: 'This is the first part of the tutorial'})
    const response = yield request(apiUrl)
      .get('questions.json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.isArray(response.body.data)
    assert.lengthOf(response.body.data, 1)
  })

  it('should be able to paginate between questions', function * () {
    yield use('App/Model/Question').createMany([{title: 'Adonis 101', body: 'This is the first part of the tutorial'}])
    const response = yield request(apiUrl)
      .get('questions.json?page=2')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.isArray(response.body.data)
    assert.lengthOf(response.body.data, 0)
    assert.equal(response.body.total, 1)
    assert.equal(response.body.perPage, 20)
    assert.equal(response.body.currentPage, 2)
    assert.equal(response.body.lastPage, 1)
  })

  it('should return validation error when title is missing', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .expect('Content-Type', /json/)
      .expect(400)
    assert.deepEqual(response.body, {status: 400, message: 'Validation failed', fields: [{field: 'title', message: 'Give your question a descriptive title', validation: 'required'}]})
  })

  it('should return validation error when body is missing', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .send({title: 'Adonis 102'})
      .expect('Content-Type', /json/)
      .expect(400)
    assert.deepEqual(response.body, {status: 400, message: 'Validation failed', fields: [{field: 'body', message: 'Write some description of your question', validation: 'required'}]})
  })

  it('should return validation error when question channel is missing', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .send({title: 'Adonis 102', body: 'Here you go'})
      .expect('Content-Type', /json/)
      .expect(400)
    assert.deepEqual(response.body, {status: 400, message: 'Validation failed', fields: [{field: 'channel', message: 'It is required to choose a channel for this question', validation: 'required'}]})
  })

  it('should return validation error when question channel is not a number', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .send({title: 'Adonis 102', body: 'Here you go', channel: 'foo'})
      .expect('Content-Type', /json/)
      .expect(400)
    assert.deepEqual(response.body, {status: 400, message: 'Validation failed', fields: [{field: 'channel', message: 'Invalid channel id', validation: 'integer'}]})
  })

  it('should return error when channel does not exists', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .send({title: 'Adonis 102', body: 'Here you go', channel: 1})
      .expect('Content-Type', /json/)
      .expect(404)
    assert.deepEqual(response.body, {status: 404, message: 'Cannot find channel with given id'})
  })

  it('should create a question with proper slug when user input is valid', function * () {
    const user = yield use('App/Model/User').find(1)
    yield use('App/Model/Channel').create({name: 'Lucid'})
    const response = yield request(apiUrl)
      .post('questions.json')
      .login(user)
      .send({title: 'Adonis 102', body: 'Here you go', channel: 1})
      .expect('Content-Type', /json/)
      .expect(200)

    assert.equal(response.body.status, 200)
    assert.equal(response.body.message, 'Question created successfully')
    assert.deepEqual(response.body.data.title, 'Adonis 102')
    assert.deepEqual(response.body.data.slug, 'adonis-102')
    assert.deepEqual(response.body.data.body, 'Here you go')
    assert.equal(typeof (response.body.data.id), 'number')
  })

  it('should return 404 when trying to fetch non-existing question', function * () {
    const response = yield request(apiUrl)
      .get('questions/adonis-102.json')
      .expect('Content-Type', /json/)
      .expect(404)
    assert.equal(response.body.message, 'Cannot find question with given slug')
    assert.equal(response.body.status, 404)
  })

  it('should return the question for a given existing slug', function * () {
    yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question'})
    const response = yield request(apiUrl)
      .get('questions/adonis-102.json')
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal(response.body.data.title, 'Adonis 102')
    assert.equal(response.body.data.slug, 'adonis-102')
  })

  it('should return 404 when trying to update a non-existing question', function * () {
    const channel = yield use('App/Model/Channel').create({name: 'General'})
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .put('questions/1.json')
      .login(user)
      .send({title: 'foo', body: 'bar', channel: channel.id})
      .expect('Content-Type', /json/)
      .expect(404)
    assert.equal(response.body.message, 'Cannot find question with given id')
  })

  it('should return validation error when trying to update question without title', function * () {
    const user = yield use('App/Model/User').find(1)
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .expect('Content-Type', /json/)
      .expect(400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'title', validation: 'required', message: 'Give your question a descriptive title'}])
  })

  it('should return validation error when trying to update question without body', function * () {
    const user = yield use('App/Model/User').find(1)
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: 'Adonis 102'})
      .expect('Content-Type', /json/)
      .expect(400)
    assert.equal(response.body.message, 'Validation failed')
    assert.deepEqual(response.body.fields, [{field: 'body', validation: 'required', message: 'Write some description of your question'}])
  })

  it('should return 400 when user trying to update the question is not allowed', function * () {
    const user = yield use('App/Model/User').find(1)
    const channel = yield use('App/Model/Channel').create({name: 'General'})
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 3})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: question.title, body: question.body, channel: channel.id})
      .expect('Content-Type', /json/)
      .expect(400)
    assert.equal(response.body.message, 'You don\'t have access to make changes to this question')
    assert.equal(response.body.status, 400)
  })

  it('should return 404 when trying to assign a non-existing channel', function * () {
    const user = yield use('App/Model/User').find(1)
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: question.title, body: question.body, channel: 1})
      .expect('Content-Type', /json/)
      .expect(404)
    assert.equal(response.body.message, 'Cannot find channel with given id')
    assert.equal(response.body.status, 404)
  })

  it('should return 200 when able to update the question successfully', function * () {
    const user = yield use('App/Model/User').find(1)
    const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: 'Adonis 103', body: question.body, channel: channel.id})
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal(response.body.status, 200)
    assert.equal(response.body.message, 'Question updated successfully')
    assert.equal(response.body.data.title, 'Adonis 103')
  })

  it('should not update the slug when title is updated', function * () {
    const user = yield use('App/Model/User').find(1)
    const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: 'Adonis 103', body: question.body, channel: channel.id})
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal(response.body.status, 200)
    assert.equal(response.body.data.slug, 'adonis-102')
  })

  it('should assign the new channel to the question when defined', function * () {
    const user = yield use('App/Model/User').find(1)
    const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .put(`questions/${question.id}.json`)
      .login(user)
      .send({title: 'Adonis 103', body: question.body, channel: channel.id})
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal(response.body.status, 200)
    assert.equal(response.body.data.slug, 'adonis-102')
    assert.equal(response.body.data.channel_id, channel.id)
  })

  it('should return 404 when question to delete doesn\'t exists', function * () {
    const user = yield use('App/Model/User').find(1)
    const response = yield request(apiUrl)
      .delete('questions/1.json')
      .login(user)
      .expect('Content-Type', /json/)
      .expect(404)
    assert.equal(response.body.status, 404)
    assert.equal(response.body.message, 'Cannot find question with given id')
  })

  it('should return 400 when user is not allowed to delete the question', function * () {
    const user = yield use('App/Model/User').find(1)
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 3})
    const response = yield request(apiUrl)
      .delete(`questions/${question.id}.json`)
      .login(user)
      .expect('Content-Type', /json/)
      .expect(400)

    assert.equal(response.body.status, 400)
    assert.equal(response.body.message, 'You don\'t have access to make changes to this question')
  })

  it('should return 200 when able to delete the question successfully', function * () {
    const user = yield use('App/Model/User').find(1)
    const question = yield use('App/Model/Question').create({title: 'Adonis 102', body: 'This is a question', user_id: 1})
    const response = yield request(apiUrl)
      .delete(`questions/${question.id}.json`)
      .login(user)
      .expect('Content-Type', /json/)
      .expect(200)

    const fetchedQuestion = yield use('App/Model/Question').find(question.id)
    assert.equal(response.body.status, 200)
    assert.equal(response.body.message, 'Question deleted successfully')
    assert.equal(fetchedQuestion, null)
  })
})

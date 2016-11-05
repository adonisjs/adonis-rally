'use strict'

const chai = use('chai')
const assert = chai.assert
const QuestionRepository = make('App/Repositories/Question')
const Question = use('App/Model/Question')
const Answer = use('App/Model/Answer')
require('co-mocha')

describe('Question Repository', function () {
  afterEach(function * () {
    const Db = use('Database')
    yield Db.truncate('questions')
    yield Db.truncate('channels')
    yield Db.truncate('users')
  })

  it('should throw an error when channel is not an instance of Channel model', function * () {
    try {
      yield QuestionRepository.add('Adonis 101', 'This is my first question', {}, {})
    } catch (e) {
      assert.match(e.message, /E_INVALID_RELATION_INSTANCE: associate accepts an instance of related model/)
    }
  })

  it('should throw an error when channel instance is not saved in database', function * () {
    try {
      const Channel = use('App/Model/Channel')
      const User = use('App/Model/User')
      yield QuestionRepository.add('Adonis 101', 'This is my first question', new Channel(), new User())
    } catch (e) {
      assert.match(e.message, /E_UNSAVED_MODEL_INSTANCE: Cannot perform associate on Channel model since Question instance is unsaved/)
    }
  })

  it('should throw an error when user is not an instance of User model', function * () {
    try {
      const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
      yield QuestionRepository.add('Adonis 101', 'This is my first question', channel, {})
    } catch (e) {
      assert.match(e.message, /E_INVALID_RELATION_INSTANCE: associate accepts an instance of related model/)
    }
  })

  it('should throw an error when user instance is not saved in database', function * () {
    try {
      const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
      const User = use('App/Model/User')
      yield QuestionRepository.add('Adonis 101', 'This is my first question', channel, new User())
    } catch (e) {
      assert.match(e.message, /E_UNSAVED_MODEL_INSTANCE: Cannot perform associate on User model since Question instance is unsaved/)
    }
  })

  it('should save question to the database when all required fields have been passed', function * () {
    const channel = yield use('App/Model/Channel').create({name: 'Lucid'})
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    yield QuestionRepository.add('Adonis 101', 'This is my first question', channel, user)
    const question = yield use('App/Model/Question').findBy('title', 'Adonis 101')
    assert.equal(question.title, 'Adonis 101')
    assert.equal(question.channel_id, channel.id)
    assert.equal(question.user_id, user.id)
  })

  it('should throw an error when unable to find question with a given id', function * () {
    try {
      yield QuestionRepository.find(1)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Cannot find question with given id')
    }
  })

  it('should return question model instance when found question with an id', function * () {
    const savedQuestion = yield Question.create({title: 'Adonis 102', body: 'This is the first title'})
    const question = yield QuestionRepository.find(savedQuestion.id)
    assert.equal(question instanceof Question, true)
    assert.equal(question.slug, 'adonis-102')
  })

  it('should throw an error when unable to find question with slug', function * () {
    try {
      yield QuestionRepository.findBySlug('adonis-102')
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Cannot find question with given slug')
    }
  })

  it('should return question model instance when found question with a slug', function * () {
    yield Question.create({title: 'Adonis 102', body: 'This is the first title'})
    const question = yield QuestionRepository.findBySlug('adonis-102')
    assert.equal(question instanceof Question, true)
    assert.equal(question.slug, 'adonis-102')
  })

  it('should throw an error when trying to update non-existing question', function * () {
    try {
      yield QuestionRepository.update(1)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Cannot find question with given id')
    }
  })

  it('should throw an error when user trying to update is not the creator of the question', function * () {
    try {
      const question = yield Question.create({title: 'adonis 101', body: 'Time to learn AdonisJs', user_id: 10})
      const user = use('Factory').model('App/Model/User').make()
      yield user.save()
      yield QuestionRepository.update(question.id, {title: question.title, body: question.body}, user, null)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'You don\'t have access to make changes to this question')
    }
  })

  it('should be able to update question attributes', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const question = yield Question.create({title: 'adonis 101', body: 'Time to learn AdonisJs', user_id: user.$primaryKeyValue})
    yield QuestionRepository.update(question.id, {title: 'Learning Adonis'}, user, null)
    const reFetchedQuestion = yield Question.find(question.id)
    assert.equal(reFetchedQuestion.title, 'Learning Adonis')
    assert.equal(reFetchedQuestion.slug, question.slug)
    assert.equal(reFetchedQuestion.body, question.body)
    assert.equal(reFetchedQuestion.channel_id, null)
  })

  it('should be able to update question channel', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const question = yield Question.create({title: 'adonis 101', body: 'Time to learn AdonisJs', user_id: user.$primaryKeyValue})
    const channel = yield use('App/Model/Channel').create({name: 'General'})
    yield QuestionRepository.update(question.id, {title: 'Learning Adonis'}, user, channel)
    const reFetchedQuestion = yield Question.find(question.id)
    assert.equal(reFetchedQuestion.channel_id, channel.id)
  })

  it('should throw an error when trying to delete a non-existing question', function * () {
    try {
      yield QuestionRepository.remove(1)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'Cannot find question with given id')
    }
  })

  it('should throw an error when user trying to remove the question is not the creator of the question', function * () {
    try {
      const question = yield Question.create({title: 'adonis 101', body: 'Time to learn AdonisJs', user_id: 10})
      const user = use('Factory').model('App/Model/User').make()
      yield user.save()
      yield QuestionRepository.remove(question.id)
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'You don\'t have access to make changes to this question')
    }
  })

  it('should be able to remove a given question', function * () {
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const question = yield Question.create({title: 'adonis 101', body: 'Time to learn AdonisJs', user_id: user.$primaryKeyValue})
    yield QuestionRepository.remove(question.id, user)
    const reFetchedQuestion = yield Question.find(question.id)
    assert.equal(reFetchedQuestion, null)
  })

  it('should throw an error when trying to add answer without a question', function * () {
    try {
      yield QuestionRepository.addAnswer('I like what you said', {})
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'E_INVALID_RELATION_INSTANCE: associate accepts an instance of related model')
    }
  })

  it('should throw an error when trying to add answer to unsaved question', function * () {
    try {
      yield QuestionRepository.addAnswer('I like what you said', new Question())
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'E_UNSAVED_MODEL_INSTANCE: Cannot perform associate on Question model since Answer instance is unsaved')
    }
  })

  it('should throw an error when user for an answer is not defined', function * () {
    try {
      const question = yield Question.create({title: 'Learning Adonis', body: 'Start learning today'})
      yield QuestionRepository.addAnswer('I like what you said', question, {})
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'E_INVALID_RELATION_INSTANCE: associate accepts an instance of related model')
    }
  })

  it('should throw an error when user for an answer does not exists', function * () {
    try {
      const question = yield Question.create({title: 'Learning Adonis', body: 'Start learning today'})
      const User = use('App/Model/User')
      yield QuestionRepository.addAnswer('I like what you said', question, new User())
      assert.equal(true, false)
    } catch (e) {
      assert.equal(e.message, 'E_UNSAVED_MODEL_INSTANCE: Cannot perform associate on User model since Answer instance is unsaved')
    }
  })

  it('should add answer to a given question', function * () {
    const question = yield Question.create({title: 'Learning Adonis', body: 'Start learning today'})
    const user = use('Factory').model('App/Model/User').make()
    yield user.save()
    const answer = yield QuestionRepository.addAnswer('I like what you said', question, user)
    assert.equal(answer instanceof Answer, true)
    assert.equal(answer.body, 'I like what you said')
    assert.equal(answer.question_id, question.id)
    assert.equal(answer.user_id, user.id)
  })
})

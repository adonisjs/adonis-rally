'use strict'

const Question = use('App/Model/Question')
const Answer = use('App/Model/Answer')
const Validator = use('App/Services/Validator')
const QuestionRepository = make('App/Repositories/Question')
const ChannelRepository = make('App/Repositories/Channel')

class QuestionsController {

  /**
   * listing all questions with a limit of
   * 20 questions per page.
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * index (request, response) {
    const currentPage = parseInt(request.input('page', 1))
    const questions = yield Question.query().paginate(currentPage)
    response.ok(questions)
  }

  /**
   * creates a new question
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * store (request, response) {
    const question = request.only('title', 'body', 'channel')
    yield Validator.validate(question, Question.rules, Question.messages)
    const channel = yield ChannelRepository.find(question.channel)
    const newQuestion = yield QuestionRepository.add(question.title, question.body, channel, request.authUser)
    response.ok({message: 'Question created successfully', status: 200, data: newQuestion})
  }

  /**
   * show a question for a given slug
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * show (request, response) {
    const question = yield QuestionRepository.findBySlug(request.param('slug'))
    yield question.related('channel', 'user').load()
    response.ok({data: question})
  }

  /**
   * Update a given question
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * update (request, response) {
    const updateAttributes = request.only('title', 'body', 'channel')
    yield Validator.validate(updateAttributes, Question.rules, Question.messages)
    const channel = yield ChannelRepository.find(updateAttributes.channel)
    const question = yield QuestionRepository.update(request.param('id'), {title: updateAttributes.title, body: updateAttributes.body}, request.authUser, channel)
    response.ok({message: 'Question updated successfully', status: 200, data: question})
  }

  /**
   * Delete a given question
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * destroy (request, response) {
    yield QuestionRepository.remove(request.param('id'), request.authUser)
    response.ok({message: 'Question deleted successfully', status: 200})
  }

  /**
   * saves answer to a given question
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * saveAnswer (request, response) {
    const body = request.input('body')
    yield Validator.validate({body: body}, Answer.rules, Answer.messages)
    const question = yield QuestionRepository.find(request.param('id'))
    const newAnswer = yield QuestionRepository.addAnswer(body, question, request.authUser)
    response.ok({message: 'Answer added successfully', status: 200, data: newAnswer})
  }

  /**
   * paginates over answers for a given question
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * getAnswers (request, response) {
    const currentPage = parseInt(request.input('page', 1))
    const question = yield QuestionRepository.find(request.param('id'))
    const answers = yield question.answers().paginate(currentPage)
    response.ok(answers)
  }

}

module.exports = QuestionsController

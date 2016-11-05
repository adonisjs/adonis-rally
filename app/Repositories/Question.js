'use strict'

const Exceptions = use('App/Exceptions')

class QuestionRepository {

  /**
   * array of dependencies to be injected to the class instance
   * This is done automatically by IoC container.
   *
   * @return     {Array}
   */
  static get inject () {
    return ['App/Model/Question', 'App/Model/Answer']
  }

  constructor (Question, Answer) {
    this.Question = Question
    this.Answer = Answer
  }

  /**
   * validates user access for a given question
   *
   * @param      {Object}  question  The question
   * @param      {Object}  user      The user
   *
   * @throws     {ApplcationException} When user is not allowed to touch the question
   *
   * @private
   */
  _validateUserAccess (question, user) {
    if (!user || !user.$primaryKeyValue || question.user_id !== user.$primaryKeyValue) {
      throw new Exceptions.ApplicationException('You don\'t have access to make changes to this question', 400)
    }
  }

  /**
   * Adding a new question by associating a given channel
   * and user.
   *
   * @param      {String}    title    The title
   * @param      {String}    body     The body
   * @param      {Object}    channel  The channel
   * @param      {Object}    user     The user
   * @return     {Object}             saved question lucid instance
   *
   * @throws     {ApplicationException} When unable to save question
   *
   * @public
   */
  * add (title, body, channel, user) {
    const newQuestion = new this.Question()
    newQuestion.title = title
    newQuestion.body = body
    newQuestion.channel().associate(channel)
    newQuestion.user().associate(user)
    yield newQuestion.save()
    if (newQuestion.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save question', 500)
    }
    return newQuestion
  }

  /**
   * Searches for the first matching question with id
   *
   * @param      {Integer}  id      The identifier
   * @return     {Object}           saved question lucid instance
   *
   * @throws     {ApplicationException} When unable to find question
   *
   * @public
   */
  * find (id) {
    return yield this.Question.findOrFail(id, () => {
      throw new Exceptions.ApplicationException('Cannot find question with given id', 404)
    })
  }

  /**
   * Searches for the first matching question with slug
   *
   * @param      {String}  slug     Question slug
   * @return     {Object}           saved question lucid instance
   *
   * @throws     {ApplicationException} When unable to find question
   *
   * @public
   */
  * findBySlug (slug) {
    const question = yield this.Question.findBySlug(slug)
    if (!question) {
      throw new Exceptions.ApplicationException('Cannot find question with given slug', 404)
    }
    return question
  }

  /**
   * Update a given question
   *
   * @param      {Integer}    id          The identifier
   * @param      {Object}    attributes  The attributes
   * @param      {Object}    user        The user
   * @param      {Function}  channel     The channel
   * @return     {Boolean}
   *
   * @public
   */
  * update (id, attributes, user, channel) {
    const question = yield this.find(id)
    this._validateUserAccess(question, user)
    question.title = attributes.title ? attributes.title : question.title
    question.body = attributes.body ? attributes.body : question.body
    if (channel && channel.id !== question.channel_id) {
      question.channel().associate(channel)
    }
    yield question.save()
    return question
  }

  /**
   * Deletes a given question
   *
   * @param      {Integer}    id          The identifier
   * @param      {Object}    user        The user
   * @return     {Boolean}
   *
   * @public
   */
  * remove (id, user) {
    const question = yield this.find(id)
    this._validateUserAccess(question, user)
    yield question.delete()
    if (!question.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete question', 500)
    }
    return true
  }

  /**
   * adds answer to a given question
   *
   * @param      {String}    body      The body
   * @param      {Object}    question  The question
   * @param      {Object}    user      The user
   * @return     {Object}              Instance of saved answer
   *
   * @throws     {ApplicationException} if unable to save question
   *
   * @public
   */
  * addAnswer (body, question, user) {
    const answer = new this.Answer()
    answer.body = body
    answer.question().associate(question)
    answer.user().associate(user)
    yield answer.save()
    if (answer.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save answer', 500)
    }
    return answer
  }

}

module.exports = QuestionRepository

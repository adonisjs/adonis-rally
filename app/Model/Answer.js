'use strict'

const Lucid = use('Lucid')

class Answer extends Lucid {

  static get rules () {
    return {
      body: 'required',
      question: 'required|integer'
    }
  }

  static get messages () {
    return {
      'body.required': 'Write your answer',
      'question.required': 'You can only post answers on a question',
      'question.integer': 'Selected question is invalid'
    }
  }

  question () {
    return this.belongsTo('App/Model/Question')
  }

  user () {
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Answer

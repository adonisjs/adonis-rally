'use strict'

const Lucid = use('Lucid')

class Answer extends Lucid {

  /**
   * rules to be used for validation before
   * adding or updating an answer
   *
   * @return {Object}
   */
  static get rules () {
    return {
      body: 'required'
    }
  }

  /**
   * messages to be printed upon validation
   * failure.
   *
   * @return {Object}
   */
  static get messages () {
    return {
      'body.required': 'Write your answer'
    }
  }

  /**
   * relationship with a given question
   *
   * @return {Object} Instance of belongsTo relation
   */
  question () {
    return this.belongsTo('App/Model/Question')
  }

  /**
   * relationship with a given user
   *
   * @return {Object} Instance of belongsTo relation
   */
  user () {
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Answer

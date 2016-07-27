'use strict'

const Lucid = use('Lucid')
const Slugify = use('App/Services/Slugify')

class Question extends Lucid {

  /**
   * lifecycle method called by Lucid internally
   */
  static boot () {
    super.boot()
    Slugify.register(this)
  }

  /**
   * key/value pair to be used for creating
   * slugs.
   *
   * @return {Object}
   */
  static get sluggable () {
    return {
      key: 'slug',
      source: 'title'
    }
  }

  /**
   * rules to be used for validation
   *
   * @return {Object}
   */
  static get rules () {
    return {
      title: 'required|max:100',
      body: 'required',
      channel: 'required|integer'
    }
  }

  /**
   * messages to be returned to the end user
   * upon validation failure
   *
   * @return {Object}
   */
  static get messages () {
    return {
      'title.required': 'Give your question a descriptive title',
      'title.max': 'Title should be {{argument.0}} characters long',
      'body.required': 'Write some description of your question',
      'channel.required': 'It is required to choose a channel for this question',
      'channel.integer': 'Invalid channel id'
    }
  }

  /**
   * relationship to a channel
   *
   * @return {Object} Instance of belongsTo relation
   */
  channel () {
    return this.belongsTo('App/Model/Channel')
  }

  /**
   * relationship to a given user
   *
   * @return {Object} Instance of belongsTo relation
   */
  user () {
    return this.belongsTo('App/Model/User')
  }

}

module.exports = Question

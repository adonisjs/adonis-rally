'use strict'

const Schema = use('Schema')

class SetFkReferencesSchema extends Schema {

  up () {
    this.table('answers', (table) => {
      table.foreign('question_id').references('id').inTable('questions')
      table.foreign('user_id').references('id').inTable('users')
    })

    this.table('questions', (table) => {
      table.foreign('channel_id').references('id').inTable('channels')
      table.foreign('user_id').references('id').inTable('users')
    })
  }

  down () {
    this.table('answers', (table) => {
      table.dropForeign('question_id')
      table.dropForeign('user_id')
    })

    this.table('questions', (table) => {
      table.dropForeign('channel_id')
      table.dropForeign('user_id')
    })
  }

}

module.exports = SetFkReferencesSchema

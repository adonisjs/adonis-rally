'use strict'

const Schema = use('Schema')

class AnswersSchema extends Schema {

  up () {
    this.create('answers', (table) => {
      table.increments()
      table.integer('question_id').references('id').inTable('questions')
      table.integer('user_id').references('id').inTable('users')
      table.boolean('best_answer').defaultTo(0)
      table.text('body', 'longtext').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('answers')
  }

}

module.exports = AnswersSchema

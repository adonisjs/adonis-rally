'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email').notNullable().unique()
      table.string('password', 72).notNullable()
      table.string('firstname').nullable()
      table.string('lastname').nullable()
      table.string('avatar').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersSchema

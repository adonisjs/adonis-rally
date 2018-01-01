'use strict'

const Schema = use('Schema')

class ChannelSchema extends Schema {

  up () {
    this.create('channels', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('channels')
  }

}

module.exports = ChannelSchema

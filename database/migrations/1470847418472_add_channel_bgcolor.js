'use strict'

const Schema = use('Schema')

class AddChannelBgcolorSchema extends Schema {

  up () {
    this.table('channels', (table) => {
      table.string('bg_color').after('name')
    })
  }

  down () {
    this.table('channels', (table) => {
      table.dropColumn('bg_color')
    })
  }

}

module.exports = AddChannelBgcolorSchema

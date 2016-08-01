'use strict'

const Schema = use('Schema')

class UpdateUsersTableSchema extends Schema {

  up () {
    this.table('users', (table) => {
      table.enum('status', ['pending-verification', 'active', 'disabled']).defaultTo('pending-verification').after('avatar')
      table.string('verification_code', 40).after('status')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('status')
      table.dropColumn('verification_code')
    })
  }

}

module.exports = UpdateUsersTableSchema

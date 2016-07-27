'use strict'

const User = use('App/Model/User')

class UserSeeder {

  * run () {
    // run model/database factories here
    yield User.create({email: 'admin@rally.com', password: 'secret', firstname: 'Aman', lastname: 'Virk'})
  }

}

module.exports = UserSeeder

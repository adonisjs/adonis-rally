'use strict'

/*
|--------------------------------------------------------------------------
| Database Seeder
|--------------------------------------------------------------------------
| Database Seeder can be used to seed dummy data to your application
| database. Here you can make use of Factories to create records.
|
| make use of Ace to generate a new seed
|   ./ace make:seed [name]
|
*/

const Channel = use('App/Model/Channel')

class DatabaseSeeder {

  * run () {
    // yield Factory.model('App/Model/User').create()
    // yield Factory.model('App/Model/User').create(5)
    const channels = [
      {
        name: 'Lucid'
      },
      {
        name: 'Routing'
      },
      {
        name: 'Cookies & Sessions'
      },
      {
        name: 'FAQ'
      },
      {
        name: 'Authentication'
      },
      {
        name: 'Ace'
      },
      {
        name: 'General'
      },
      {
        name: 'Views & Templates'
      },
      {
        name: 'Error Handling'
      },
      {
        name: 'Database'
      },
      {
        name: 'Redis'
      },
      {
        name: 'Mail'
      },
      {
        name: 'Service Providers'
      }
    ]

    yield Channel.createMany(channels)
  }

}

module.exports = DatabaseSeeder

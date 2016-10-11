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
        name: 'Lucid',
        bg_color: '#FF4136'
      },
      {
        name: 'Routing',
        bg_color: '#39CCCC'
      },
      {
        name: 'Cookies & Sessions',
        bg_color: '#3D9970'
      },
      {
        name: 'FAQ',
        bg_color: '#85144b'
      },
      {
        name: 'Authentication',
        bg_color: '#FF851B'
      },
      {
        name: 'Ace',
        bg_color: '#0074D9'
      },
      {
        name: 'General',
        bg_color: '#111111'
      },
      {
        name: 'Views & Templates',
        bg_color: '#FFDC00'
      },
      {
        name: 'Database',
        bg_color: '#01FF70'
      },
      {
        name: 'Redis',
        bg_color: '#FF4136'
      },
      {
        name: 'Mail',
        bg_color: '#001f3f'
      },
      {
        name: 'Service Providers',
        bg_color: '#B10DC9'
      }
    ]

    yield Channel.createMany(channels)
  }

}

module.exports = DatabaseSeeder

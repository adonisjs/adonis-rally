'use strict'

/*
|--------------------------------------------------------------------------
| Mail Configuration
|--------------------------------------------------------------------------
|
| This file is used by adonis mail provider to fetch settings for
| different mail drivers.
|
| Log driver is used while writing tests
|
*/

const Helpers = use('Helpers')
const Env = use('Env')

module.exports = {
  driver: Env.get('MAIL_DRIVER', 'mailgun'),

  mailgun: {
    domain: Env.get('MAILGUN_DOMAIN'),
    apiKey: Env.get('MAILGUN_APIKEY')
  },

  log: {
    toPath: Helpers.storagePath('logs/mail.eml')
  }
}

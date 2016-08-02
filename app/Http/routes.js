'use strict'

const Route = use('Route')

/**
 * API specific routes
 */
Route.group('api', () => {
  Route
    .resource('questions', 'QuestionsController')
    .only(['index', 'store', 'update', 'destroy'])
    .middleware({
      auth: ['store', 'update', 'destroy']
    })
    .addCollection(':slug', 'GET', (collection) => {
      collection.bindAction('QuestionsController.show')
    })
    .addMember('answers', 'GET', (member) => {
      member.bindAction('QuestionsController.getAnswers')
    })
    .addMember('answers', 'POST', (member) => {
      member.bindAction('QuestionsController.saveAnswer').middleware('auth')
    })

  Route.get('/channels', 'ChannelsController.index')
  Route.put('answers/:id', 'AnswersController.update')
  Route.delete('answers/:id', 'AnswersController.delete')
})
.prefix('/api/v1')
.formats(['json'], true) // all urls needs to have .json extension

/**
 * Login and signup routes. They will be global
 * regardless of the API version.
 */
Route.on('/').render('welcome')
Route.post('/login', 'UsersController.login')
Route.post('/register', 'UsersController.register')
Route.get('/account/verify', 'UsersController.verifyAccount')
Route.post('/email/send', 'UsersController.sendVerificationEmail')

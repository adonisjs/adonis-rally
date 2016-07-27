'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

/**
 * API specific routes
 */
Route.group('api', () => {
  Route.get('/questions', 'QuestionsController.index')
  Route.post('/questions', 'QuestionsController.store').middleware('auth')
  Route.get('/questions/:slug', 'QuestionsController.show')
  Route.put('/questions/:id', 'QuestionsController.update').middleware('auth')
  Route.delete('/questions/:id', 'QuestionsController.destroy').middleware('auth')
  Route.get('/channels', 'ChannelsController.index')
  Route.post('/questions/:id/answers', 'QuestionsController.saveAnswer').middleware('auth')
  Route.get('/questions/:id/answers', 'QuestionsController.getAnswers')
  Route.put('answers/:id', 'AnswersController.update')
  Route.delete('answers/:id', 'AnswersController.delete')
})
.prefix('/api/v1')
.formats(['json'], true) // all urls needs to have .json extension

/**
 * Login and signup routes. They will be global
 * regardless of the API version.
 */
Route.post('/login', 'UsersController.login')

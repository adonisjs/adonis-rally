# Adonis Rally

Adonis rally is a forum created using VueJs and AdonisJs. The API of the framework is written is Adonis and checkout the rally-frontend repo to grab the VueJs code.

> Work in progress

## Features

1. Show a list of questions on the homepage.
2. Ability to filter questions. Based upon channel and author.
3. Ability to sort by Latest, Popular.
4. Ability to create new questions.
5. Registration/Login.
6. Email verification.
7. Password reset.
8. Profile management.
10. Post answers to questions.
11. Choose favourite answer.

## Setup

Setting up the project is quite easy. Start by cloning the repo.

#### clone
```bash
git clone https://github.com/adonisjs/adonis-rally
```

#### make install

Make install will perform all the require steps to setup the application for you.

```bash
make install
```

#### running the server

```bash
npm run dev
```

## Tests

Tests are divided into multiple categories with Unit and Functional tests. `Unit tests` tests the isolated Repositories/Services, whereas `Functional tests` comes from outside in to test the controllers/routes.

#### Testing Environment

Testing environment is configured with the help of `.env.test` file. You are free to add/modify any variables here and they will be picked while running tests.

#### Running Tests
To run all tests
```bash
npm run test
```

To run unit tests
```bash
npm run test -- --filter=unit
```

To run functional tests
```bash
npm run test -- --filter=functional
```


## Contributing

Feel free to fork and work on the missing parts of the application and create a PR for same. Make sure to work on small pieces of code with decent testing coverage before creating a PR.


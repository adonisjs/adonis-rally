'use strict'

const chai = use('chai')
const assert = chai.assert
const Slugify = use('App/Services/Slugify')
const Lucid = use('Lucid')
use('co-mocha')

class Question extends Lucid {
}

describe('Slug Service', function () {
  beforeEach(function * () {
    yield use('Database').truncate('questions')
  })

  it('should generate a slug for a given title', function * () {
    const slug = yield Slugify.createUniqueSlug(Question, 'slug', 'Adonis 101')
    assert.equal(slug, 'adonis-101')
  })

  it('should generate a slug for a given title even if same slug exists', function * () {
    yield Question.create({title: 'Adonis 101', slug: 'adonis-101', body: 'Start learning'})
    const slug = yield Slugify.createUniqueSlug(Question, 'slug', 'Adonis 101')
    assert.equal(slug, 'adonis-101-1')
  })

  it('should generate a slug for a given title if slug counts are messed up', function * () {
    yield Question.createMany([{title: 'Adonis 101', slug: 'adonis-101', body: 'Start learning'}, {title: 'Adonis 101', slug: 'adonis-101-3', body: 'Start learning'}])
    const slug = yield Slugify.createUniqueSlug(Question, 'slug', 'Adonis 101')
    assert.equal(slug, 'adonis-101-4')
  })

  it('should return 1 as the max num when both slugs are same', function * () {
    const maxNum = Slugify.getMaxNumber('adonis-101', 'adonis-101')
    assert.equal(maxNum, 1)
  })

  it('should add 1 to the old slug count', function * () {
    const maxNum = Slugify.getMaxNumber('adonis-101-4', 'adonis-101')
    assert.equal(maxNum, 5)
  })
})

'use strict'

const slug = use('slug')
const Slugify = exports = module.exports = {}

/**
 * generates a unique slug for a given model
 * by registering the triat
 *
 * @param  {Object} model
 */
Slugify.register = (model) => {
  /**
   * configurable options of the model
   */
  const source = model.sluggable.source
  const key = model.sluggable.key

  /**
   * adds a scoped method to the model instance to add
   * a where clause to slug field.
   *
   * @param      {Object}  queryBuilder  The query builder
   * @param      {String}  value         The value
   */
  model.scopeWhereSlug = function (queryBuilder, value) {
    queryBuilder.where(key, value)
  }

  /**
   * decorates model by adding a slug method to
   * find a given record or fail
   *
   * @param {String} value
   *
   * @yield {Object}
   */
  model.findBySlug = function * (value) {
    return yield this.query().where(key, value).first()
  }

  /**
   * decorates model by adding a slug method to
   * find a given record or fail
   *
   * @param {String} value
   *
   * @yield {Object}
   *
   * @throws {Error} If Unable to find model with given slug.
   */
  model.findBySlugOrFail = function * (value) {
    const modelInstance = yield this.findBySlug(value)
    if (!modelInstance) {
      throw new Error('Cannot find row with given slug')
    }
    return modelInstance
  }

  /**
   * adding beforeCreate hook to the model to generate
   * a slug
   */
  model.addHook('beforeCreate', function * (next) {
    this[key] = yield Slugify.createUniqueSlug(model, key, this[source])
    yield next
  })
}

/**
 * returns a unique slug for a given model and slug field
 *
 * @param      {Object}    model      The model
 * @param      {String}    slugField  The slug field
 * @param      {string}    source     The source
 * @return     {string}
 *
 * @public
 */
Slugify.createUniqueSlug = function * (model, slugField, source) {
  const generatedSlug = slug(source.toLowerCase())
  const matchingSlug = yield model
    .query()
    .where(slugField, generatedSlug)
    .orWhere(slugField, 'like', `${generatedSlug}%`)
    .orderBy(model.primaryKey, 'desc')
    .first()

  if (!matchingSlug || !matchingSlug[slugField]) {
    return generatedSlug
  }
  return `${generatedSlug}-${Slugify.getMaxNumber(matchingSlug[slugField], generatedSlug)}`
}

/**
 * returns the max number to be used for duplicate
 * slugs
 *
 * @param      {String}  slug           The slug
 * @param      {String}  generatedSlug  The generated slug
 * @return     {number}  The maximum number.
 *
 * @public
 */
Slugify.getMaxNumber = function (slug, generatedSlug) {
  if (slug === generatedSlug) {
    return 1
  }
  const slugParts = slug.split('-')
  return parseInt(slugParts[slugParts.length - 1]) + 1
}

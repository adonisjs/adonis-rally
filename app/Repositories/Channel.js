'use strict'

const Exceptions = use('App/Exceptions')

class Channel {

  static get inject () {
    return ['App/Model/Channel']
  }

  constructor (Channel) {
    this.Channel = Channel
  }

  /**
   * Finds a channel with the channel id
   *
   * @param      {Integer}  id      The identifier
   * @return     {Object}           Channel instance
   *
   * @throws     {ApplicationException} If cannot find the channel.
   *
   * @public
   */
  * find (id) {
    return yield this.Channel.findOrFail(id, () => {
      throw new Exceptions.ApplicationException('Cannot find channel with given id', 404)
    })
  }

}

module.exports = Channel

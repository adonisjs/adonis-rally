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
    const channel = yield this.Channel.find(id)
    if (!channel) {
      throw new Exceptions.ApplicationException('Cannot find channel with given id', 404)
    }
    return channel
  }

}

module.exports = Channel

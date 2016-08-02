'use strict'

const Channel = use('App/Model/Channel')

class ChannelsController {

  /**
   * returns list of all the channels
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * index (request, response) {
    const channels = yield Channel.all()
    response.ok(channels)
  }

}

module.exports = ChannelsController

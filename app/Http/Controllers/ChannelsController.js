'use strict'

const Channel = use('App/Model/Channel')

class ChannelsController {

  * index (request, response) {
    const channels = yield Channel.all()
    response.ok(channels)
  }

}

module.exports = ChannelsController

import Api from '@/services/Api'

export default {

  // API on '/destination'
  postDestination (data) {
    return Api().post('destinations', data)
  },
  deleteDestination (destinationId) {
    return Api().delete('destinations', {
      data: {
        id: destinationId
      }
    })
  },

  // API on '/destination/:destinationId'
  getDestination (destinationId) {
    return Api().get('destination/' + destinationId)
  },
  patchDestination (destinationId, data) {
    return Api().patch('destinations/' + destinationId, data)
  },

  // API on '/destinations/trip/:tripId'
  getDestinations (tripId) {
    return Api().get('destinations/trip/' + tripId)
  },
  deleteTripDestinations (tripId) {
    console.log(tripId)
    return Api().delete('destinations/trip/' + tripId)
  },

  // API on '/destinations/user/:userId'
  getDestinationsByAuthor (authorId) {
    return Api().get('destinations/user/' + authorId)
  }
}

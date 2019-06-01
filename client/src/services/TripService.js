import Api from '@/services/Api'

export default {
  getTrips (userId) {
    return Api().get('trips/' + userId)
  },
  post (trip) {
    return Api().post('trips', trip)
  },
  deleteTrip (userId, tripId) {
    return Api().delete('trips/' + userId, {
      data: {
        tripId: tripId
      }
    })
  },
  showTrip (tripId) {
    return Api().get('/trip-details/' + tripId)
  },
  updateTrip (tripId, data) {
    return Api().patch('/trip-details/' + tripId, data)
  }
}

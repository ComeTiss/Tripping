const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const TripController = require('./controllers/TripController')
const DestinationController = require('./controllers/DestinationController')

module.exports = (app) => {
  // Authentiation
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register
  )
  app.post('/login', AuthenticationController.login)

  // Trips
  app.get('/trips/:userId',
      AuthenticationControllerPolicy.validUser,
      TripController.GetAllByAuthor
  )
  app.post('/trips',
      AuthenticationControllerPolicy.validUser,
      TripController.CreateTrip
  )
  app.delete('/trips/:userId',
      AuthenticationControllerPolicy.validUser,
      TripController.DeleteTrip
  )

  app.get('/trip-details/:tripId',
      AuthenticationControllerPolicy.validUser,
      TripController.GetOneTrip
  )
  app.put('/trip-details/:tripId',
      AuthenticationControllerPolicy.validUser,
      TripController.UpdateTrip
  )
  app.patch('/trip-details/:tripId',
      AuthenticationControllerPolicy.validUser,
      TripController.UpdateTrip
  )

  // Destinations
  app.post('/destinations',
      AuthenticationControllerPolicy.validUser,
      DestinationController.postDestination
  )
  app.delete('/destinations',
      AuthenticationControllerPolicy.validUser,
      DestinationController.deleteDestination
  )
  app.get('/destination/:destinationId',
      AuthenticationControllerPolicy.validUser,
      DestinationController.getDestination
  )
  app.patch('/destinations/:destinationId',
      AuthenticationControllerPolicy.validUser,
      DestinationController.patchDestination
  )
  app.get('/destinations/trip/:tripId',
      AuthenticationControllerPolicy.validUser,
      DestinationController.getDestinationsByTrip
  )
  app.delete('/destinations/trip/:tripId',
      AuthenticationControllerPolicy.validUser,
      DestinationController.deleteTripDestinations
  )
  app.get('/destinations/user/:authorId',
      AuthenticationControllerPolicy.validUser,
      DestinationController.getDestinationsByAuthor
  )

}

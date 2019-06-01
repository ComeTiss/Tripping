const {Trip} = require('../models')

module.exports = {

  async GetAllByAuthor (req, res) {
    try  {
      const trips = await Trip.findAll ({
        where: {
          authorID: req.params.userId
        }
      });
      res.send(trips)
    } catch (err) {
      res.status(500).send({
        error: 'Failed to get Trips'
      })
    }
  },
  async GetOneTrip (req, res) {
    try  {
      const trip = await Trip.findById(req.params.tripId)
      res.send(trip)
    } catch (err) {
      res.status(500).send({
        error: 'Failed to get Trips'
      })
    }
  },
  async UpdateTrip (req, res) {
    try  {
      await Trip.update (
         req.body,
         {where: {id: req.params.tripId}},
      )
      res.send('Trip succesfully updated')
    } catch (err) {
      res.status(500).send({
        error: 'Failed to update Trip'
      })
    }
  },
  async DeleteTrip (req, res) {
    try  {
        // delete trip from db
        await Trip.destroy ({
          where: {
            id: req.body.tripId,
            authorID: req.params.userId
          }
      })
      res.send('Trip succesfully deleted')
    } catch (err) {
      res.status(500).send({
        error: 'Failed to delete Trip'
      })
    }
  },
  async CreateTrip (req, res) {
    try  {
      const trip = await Trip.create (req.body)
      res.send(trip.toJSON())
    } catch (err) {
      res.status(500).send({
        error: 'Failed to post Trip'
      })
    }
  }

};

const {Destination} = require('../models');

module.exports = {
  async getDestinationsByAuthor (req, res) {
    try {
      const destinations = await Destination.findAll({
        where: {
          authorId: req.params.authorId
        },
        order: [
          ['tripId',  'ASC'],
          ['id',  'ASC']
        ]
      });
      res.send({destinations})

    } catch (err) {
      res.status(400).send({
        error: 'Failed to get destinations: ' + err
      })
    }
  },
  async getDestinationsByTrip (req, res) {
    try {
      const destinations = await Destination.findAll({
        where: {
          tripId: req.params.tripId
        }
      });
      res.send({destinations})

    } catch (err) {
      res.status(400).send({
        error: 'Failed to get destinations.'
      })
    }
  },
  async getDestination (req, res) {
    try {
      const destination = await Destination.findByPk(req.params.destinationId)
      res.send(destination)
    } catch (err) {
      res.status(400).send({
        error: 'Failed to get destination'
      })
    }
  },
  async postDestination (req, res) {
    try {
      const destination = await Destination.create(req.body);
      const destinationJSON =
      res.send({
        destination: destination.toJSON()
      })
    } catch (err) {
      res.status(400).send({
        error: 'Failed to create destination.'
      })
    }
  },
  async deleteDestination (req, res) {
    try  {
      const trips = await Destination.destroy ({
        where: {
          id: req.body.id
        }
      });
      res.send('Destination succesfully deleted')
    } catch (err) {
      res.status(500).send({
        error: 'Failed to delete destination'
      })
    }
  },
  async deleteTripDestinations (req, res) {
    try  {
      const trips = await Destination.destroy ({
        where: {
          tripId: req.params.tripId
        }
      });
      res.send('All Destinations succesfully deleted')
    } catch (err) {
      res.status(500).send({
        error: 'Failed to delete trip destinations'
      })
    }
  },
  async patchDestination (req, res) {
    try {
      await Destination.update (
        req.body,
        {
          where: {
            id: req.params.destinationId
          }
        }
      )
      res.send("Update succesful");
    } catch (err) {
      res.status(400).send({
        error: 'Failed to patch destination.'
      })
    }
  }
};

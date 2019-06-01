const Joi = require('joi')
const atob = require('atob')
const {User} = require('../models')

module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    }

    const {error, value} = Joi.validate(req.body, schema)
    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email adress'
          })
          break
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
            <br>
            1. It must contain ONLY the following characters: lower case, upper case, numerics
            <br>
            2. it must be 8-32 characters long`
          })
          break
        default:
        res.status(404).send({
          error: 'Invalid Registration informations'
        })
      }
    }  else {
      next()
    }
  },
  async validUser (req, res, next) {
    try {
        let base64 = req.headers.authorization.split(" ")[1];
        let auth = atob(base64);
        let userId = auth.split(":")[0];
        let token = auth.split(":")[1];
        const count = await User.count({
            where: {
                id: userId,
                password: token
            }
        });

        if(count != 1) {
            res.status(400).send({
                error: 'Request not authorised'
            })
            return;
        }

        next();
    } catch (error) {
        res.status(400).send({
            error: 'Error validating request'
        })
    }
  }
};

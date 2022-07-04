import Joi from 'joi'

export const createValidator = Joi.object({
  acro: Joi.string().required(),
  name: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required()
})

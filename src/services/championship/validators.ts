import Joi from 'joi'

export const createValidator = Joi.object({
  name: Joi.string().required(),
  season: Joi.number().required(),
  country: Joi.string().required()
})

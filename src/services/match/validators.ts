import Joi from 'joi'

export const createValidator = Joi.object({
  championshipId: Joi.string().guid().required(),
  houseId: Joi.string().guid().required(),
  visitorId: Joi.string().guid().required(),
  start: Joi.string().required(),
  end: Joi.string().required()
})

export const fullfillValidator = Joi.object({
  id: Joi.string().guid().required(),
  house: Joi.number().required(),
  visitor: Joi.number().required()
})

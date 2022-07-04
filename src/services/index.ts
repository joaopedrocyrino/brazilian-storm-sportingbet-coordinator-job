import { AuthenticationError, UserInputError } from 'apollo-server'
import Joi from 'joi'

import { Jwt, Uuid } from '../frameworks'

class Services {
  protected createBase (): { id: string } {
    return { id: Uuid.generate() }
  };

  protected async gateway ({ token, schema, req, scope }: {
    token?: string
    schema?: Joi.ObjectSchema<any>
    req?: any
    scope?: boolean
  }): Promise<void> {
    if (scope) {
      const error = await Jwt.decode(token)
      if (error) { throw new AuthenticationError('not_authenticated') }
    }

    this.checkRequest(req, schema)
  }

  private readonly checkRequest = (
    request: any,
    schema?: Joi.ObjectSchema<any>
  ): void => {
    if (schema) {
      const { error } = schema.validate(request)
      if (error) {
        console.log(error)
        throw new UserInputError('')
      }
    }
  }
};

export default Services

import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface RequestSchemas {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validateRequest = (schemas: RequestSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validationErrors: Joi.ValidationErrorItem[] = [];

    // Validate body
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    // Validate query parameters
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    // Validate route parameters
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) {
        validationErrors.push(...error.details);
      }
    }

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map(d => d.message);
      logger.warn(`Validation Error for ${req.method} ${req.originalUrl}: ${errorMessages.join(', ')}`);
      res.status(400).json({
        message: 'Validation failed',
        errors: errorMessages,
      });
      return;
    }

    next();
  };
};

import Joi from 'joi';

export const loginSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().trim().required().messages({
      'string.base': 'Username must be a string',
      'string.empty': 'Username is required',
      'any.required': 'Username is required',
    }),
    password: Joi.string().required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),
  // Example for query or params if needed for other routes:
  // query: Joi.object({
  //   page: Joi.number().integer().min(1).optional(),
  // }),
  // params: Joi.object({
  //   id: Joi.string().guid({ version: 'uuidv4' }).required(),
  // })
});

// Add other auth-related schemas here if necessary
// e.g., registrationSchema, refreshTokenSchema etc.

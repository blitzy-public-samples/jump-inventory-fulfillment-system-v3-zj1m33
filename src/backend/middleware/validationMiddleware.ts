import express from 'express';
import Joi from 'joi';
import { ApiError } from 'src/shared/utils/ApiError';
import { handleApiError } from 'src/shared/utils/index';

const createValidationMiddleware = (schema: Joi.Schema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const apiError = new ApiError(400, 'Validation Error', error.details);
      return handleApiError(apiError, req, res, next);
    }
    next();
  };
};

export const validateLoginInput = () => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return createValidationMiddleware(schema);
};

export const validateRegistrationInput = () => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('admin', 'user').required()
  });
  return createValidationMiddleware(schema);
};

export const validatePasswordChangeInput = () => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmNewPassword: Joi.ref('newPassword')
  });
  return createValidationMiddleware(schema);
};

export const validatePasswordResetInput = () => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  });
  return createValidationMiddleware(schema);
};

export const validateOrderInput = () => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  });
  return createValidationMiddleware(schema);
};

export const validateInventoryInput = () => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    location: Joi.string().required()
  });
  return createValidationMiddleware(schema);
};

export const validateProductInput = () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    sku: Joi.string().required(),
    category: Joi.string().required()
  });
  return createValidationMiddleware(schema);
};

export const validateShippingInput = () => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    carrier: Joi.string().required(),
    trackingNumber: Joi.string().required()
  });
  return createValidationMiddleware(schema);
};
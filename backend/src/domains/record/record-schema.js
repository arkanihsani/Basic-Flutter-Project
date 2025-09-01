import Joi from "joi";

export const createRecordSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be a positive number",
      "number.precision": "Amount can have at most 2 decimal places",
      "any.required": "Amount is required"
    }),
  description: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description cannot be empty",
      "string.max": "Description must not exceed 255 characters",
      "any.required": "Description is required"
    }),
  type: Joi.string()
    .valid("income", "expense")
    .required()
    .messages({
      "string.base": "Type must be a string",
      "any.only": "Type must be either 'income' or 'expense'",
      "any.required": "Type is required"
    }),
});

export const updateRecordSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be a positive number",
      "number.precision": "Amount can have at most 2 decimal places"
    }),
  description: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      "string.empty": "Description cannot be empty",
      "string.min": "Description cannot be empty",
      "string.max": "Description must not exceed 255 characters"
    }),
  type: Joi.string()
    .valid("income", "expense")
    .optional()
    .messages({
      "string.base": "Type must be a string",
      "any.only": "Type must be either 'income' or 'expense'"
    }),
}).min(1).messages({
  "object.min": "At least one field (amount or description) is required for update"
});

export const getRecordByIdSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.base": "ID must be a string",
      "string.uuid": "ID must be a valid UUID",
      "any.required": "ID is required"
    }),
});


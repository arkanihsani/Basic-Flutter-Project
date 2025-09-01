import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required"
    }),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password is required",
      "any.required": "Password is required"
    }),
});

export const registerSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 2 characters long",
      "string.max": "Username must not exceed 50 characters",
      "any.required": "Username is required"
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required"
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
  password_confirmation: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Password confirmation is required",
      "any.only": "Password confirmation must match password",
      "any.required": "Password confirmation is required"
    }),
});

export const updateProfileSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional()
    .messages({
      "string.min": "Username must be at least 2 characters long",
      "string.max": "Username must not exceed 50 characters"
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      "string.email": "Please provide a valid email address"
    }),
  new_password: Joi.string()
    .min(8)
    .optional()
    .messages({
      "string.min": "New password must be at least 8 characters long"
    }),
}).min(1).unknown(false).messages({
  "object.min": "At least one field is required for update"
});
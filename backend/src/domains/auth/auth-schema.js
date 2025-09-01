import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required"
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required"
    }),
});

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters",
      "any.required": "Name is required"
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required"
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required"
    }),
  password_confirmation: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Password confirmation is required",
      "any.only": "Password confirmation must match password",
      "any.required": "Password confirmation is required"
    }),
  role: Joi.string()
    .valid("user", "admin")
    .optional()
    .messages({
      "any.only": "Role must be either 'user' or 'admin'"
    }),
});

export const getMeSchema = Joi.object({
});

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters"
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Please provide a valid email address"
    }),
  new_password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .optional()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base": "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }),
}).min(1).unknown(false).messages({
  "object.min": "At least one field is required for update"
});

export const deleteAccountSchema = Joi.object({ 
}).unknown(false).messages({
  "object.unknown": "Request body is not allowed for account deletion"
});
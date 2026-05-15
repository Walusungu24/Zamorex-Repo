// middleware/validation.js
const Joi = require("joi");

// User registration validation
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
    role: Joi.string().valid("farmer", "buyer").required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Product validation
const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string()
      .valid("vegetables", "fruits", "grains", "dairy", "meat", "other")
      .default("other"),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateRegister, validateLogin, validateProduct };

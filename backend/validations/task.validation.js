import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('').max(5000).default(''),
  status: Joi.string().valid('pending', 'done').default('pending')
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().allow('').max(5000),
  status: Joi.string().valid('pending', 'done')
}).min(1);

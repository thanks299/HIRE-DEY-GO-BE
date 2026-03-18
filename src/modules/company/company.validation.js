import Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(2000).optional(),
  website: Joi.string().uri().trim().optional().allow(""),
  industry: Joi.string().trim().optional(),
  size: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .optional(),
  location: Joi.string().trim().optional(),
});

export const updateCompanySchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  description: Joi.string().trim().max(2000).optional(),
  website: Joi.string().uri().trim().optional().allow(""),
  industry: Joi.string().trim().optional(),
  size: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .optional(),
  location: Joi.string().trim().optional(),
}).min(1);

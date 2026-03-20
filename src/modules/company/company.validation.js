import Joi from "joi";
 
const socialLinksSchema = Joi.object({
  linkedin: Joi.string().uri().trim().optional().allow("", null),
  twitter: Joi.string().uri().trim().optional().allow("", null),
  facebook: Joi.string().uri().trim().optional().allow("", null),
  instagram: Joi.string().uri().trim().optional().allow("", null),
  youtube: Joi.string().uri().trim().optional().allow("", null),
});
 
const currentYear = new Date().getFullYear();
 
export const createCompanySchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  about: Joi.string().trim().max(3000).optional(),
  description: Joi.string().trim().max(2000).optional(),
  address: Joi.string().trim().max(300).optional(),
  website: Joi.string().uri().trim().optional().allow(""),
  phone: Joi.string().trim().optional().allow("", null),
  workEmail: Joi.string().email().trim().lowercase().optional().allow(""),
  industry: Joi.string().trim().max(100).optional(),
  organizationType: Joi.string()
    .valid("PRIVATE", "PUBLIC", "NON_PROFIT", "GOVERNMENT", "STARTUP", "FREELANCE", "OTHER")
    .optional(),
  teamSize: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .optional(),
  yearEstablished: Joi.number().integer().min(1800).max(currentYear).optional(),
  location: Joi.string().trim().max(200).optional(),
  country: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  socialLinks: socialLinksSchema.optional(),
}).unknown();
 
export const updateCompanySchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional(),
  about: Joi.string().trim().max(3000).optional(),
  description: Joi.string().trim().max(2000).optional(),
  address: Joi.string().trim().max(300).optional(),
  website: Joi.string().uri().trim().optional().allow(""),
  phone: Joi.string().trim().optional().allow("", null),
  workEmail: Joi.string().email().trim().lowercase().optional().allow(""),
  industry: Joi.string().trim().max(100).optional(),
  organizationType: Joi.string()
    .valid("PRIVATE", "PUBLIC", "NON_PROFIT", "GOVERNMENT", "STARTUP", "FREELANCE", "OTHER")
    .optional(),
  teamSize: Joi.string()
    .valid("1-10", "11-50", "51-200", "201-500", "501-1000", "1000+")
    .optional(),
  yearEstablished: Joi.number().integer().min(1800).max(currentYear).optional(),
  location: Joi.string().trim().max(200).optional(),
  country: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  socialLinks: socialLinksSchema.optional(),
}).min(1).unknown();
 
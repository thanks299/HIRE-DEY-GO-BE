import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
});

// wrapping zod to match Thank's  validation middleware
export const validateProfileUpdate = (data) => {
  const result = profileSchema.safeParse(data);
  
  if (result.success) {
    return { isValid: true, errors: null, sanitized: result.data };
  }
  
  return { 
    isValid: false, 
    errors: result.error.flatten().fieldErrors, 
    sanitized: null 
  };
};
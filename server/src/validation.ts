import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.').max(80),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  password: z.string().min(8, 'Password must contain at least 8 characters.').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const readingSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date.')
    .refine((date) => {
      const parsed = new Date(`${date}T00:00:00.000Z`);
      return !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
    }, 'Please enter a valid date.')
    .refine((date) => {
      const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
      }).format(new Date());

      return date <= today;
    }, 'Date cannot be in the future.'),

  slot: z.enum([
    'MORNING',
    'AFTER_BREAKFAST',
    'AFTER_LUNCH',
    'AFTER_DINNER',
  ]),

  value: z.number({
    error: 'Please enter a glucose value.',
  })
    .int('Value must be a whole number.')
    .min(40, 'Value must be between 40 and 600 mg/dl.')
    .max(600, 'Value must be between 40 and 600 mg/dl.'),
});

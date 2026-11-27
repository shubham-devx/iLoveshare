import { z } from 'zod';

export const experienceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.string().min(1).max(50),
  recipient_type: z.string().min(1).max(50),
  recipient_name: z.string().min(1, 'Recipient name is required').max(120),
  sender_name: z.string().min(1, 'Sender name is required').max(120),
  relationship: z.string().max(120).optional().nullable(),
  personal_greeting: z.string().max(500).optional().nullable(),
  message: z.string().max(10000).optional().nullable(),
  theme: z.string().min(1).max(50).default('romantic'),
  animations: z.array(z.string()).default([]),
  music_enabled: z.boolean().default(false),
  music_url: z.string().max(500).optional().nullable(),
  response_type: z.string().min(1).max(50).default('thank_you'),
  custom_response_label: z.string().max(100).optional().nullable(),
  enable_star_rating: z.boolean().default(true),
  enable_written_feedback: z.boolean().default(true),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  scheduled_at: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  passcode: z.string().max(64).optional().nullable(),
  language: z.enum(['en', 'hi']).default('en'),
  scratch_message: z.string().max(500).optional().nullable(),
  creative_features: z.array(z.string()).default([]),
  group_delivery: z.boolean().default(false),
  lock_after_response: z.boolean().default(false),
  event_details: z
    .object({
      eventDate: z.string().max(100).optional(),
      eventTime: z.string().max(100).optional(),
      location: z.string().max(300).optional(),
      mapLink: z.string().max(500).optional(),
    })
    .optional()
    .nullable(),
  milestones: z
    .array(
      z.object({
        date: z.string().max(60),
        title: z.string().max(120),
        description: z.string().max(500),
      })
    )
    .max(20)
    .optional()
    .nullable(),
});

export const responseSubmissionSchema = z.object({
  token: z.string().min(8).max(128),
  response_type: z.string().min(1).max(50),
  response_value: z.string().min(1).max(200),
  respondent_name: z.string().max(120).optional().nullable(),
  star_rating: z.number().int().min(1).max(5).optional().nullable(),
  written_feedback: z.string().max(2000).optional().nullable(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Please enter a valid email address').max(200),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  bio: z.string().max(500).optional().nullable(),
});

export function sanitizePlainText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

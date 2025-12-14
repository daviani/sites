'use server';

import { headers } from 'next/headers';
import { contactSchema } from '@/lib/schemas/contact';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendContactEmail } from '@/lib/email';

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
  favorite_color: string; // Honeypot field
}

interface ContactFormResult {
  success: boolean;
  error?: 'bot_detected' | 'rate_limited' | 'recaptcha_failed' | 'validation_error' | 'email_error';
  fieldErrors?: Record<string, string[]>;
}

export async function submitContactForm(
  data: ContactFormInput
): Promise<ContactFormResult> {
  // 1. Honeypot check - if filled, it's a bot
  if (data.favorite_color) {
    return { success: false, error: 'bot_detected' };
  }

  // 2. Get client IP for rate limiting
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // 3. Rate limit check
  const { allowed } = await checkRateLimit(ip, 'contact');
  if (!allowed) {
    return { success: false, error: 'rate_limited' };
  }

  // 4. ReCaptcha verification
  if (!data.recaptchaToken) {
    return { success: false, error: 'recaptcha_failed' };
  }

  const recaptchaValid = await verifyRecaptcha(data.recaptchaToken);
  if (!recaptchaValid) {
    return { success: false, error: 'recaptcha_failed' };
  }

  // 5. Form validation with Zod
  const validationResult = contactSchema.safeParse({
    name: data.name,
    email: data.email,
    message: data.message,
  });

  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    validationResult.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    });

    return { success: false, error: 'validation_error', fieldErrors };
  }

  // 6. Send email
  const emailResult = await sendContactEmail(validationResult.data);
  if (!emailResult.success) {
    return { success: false, error: 'email_error' };
  }

  return { success: true };
}

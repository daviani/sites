'use client';

import { useState, FormEvent } from 'react';
import { useRecaptcha, useTranslation } from '@nordic-island/ui';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface ContactFormResult {
  success: boolean;
  error?:
    | 'bot_detected'
    | 'rate_limited'
    | 'recaptcha_failed'
    | 'validation_error'
    | 'email_error';
  fieldErrors?: Record<string, string[]>;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
  favorite_color: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<ContactFormResult>;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const { execute, load, isLoaded } = useRecaptcha();

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    favorite_color: '', // Honeypot
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    setFieldErrors({});

    try {
      // Get reCAPTCHA token (auto-loads if not already loaded)
      const recaptchaToken = await execute('contact_form');

      const result = await onSubmit({
        ...formData,
        recaptchaToken,
      });

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', favorite_color: '' });
      } else {
        setStatus('error');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        switch (result.error) {
          case 'rate_limited':
            setErrorMessage(t('contact.form.rateLimited'));
            break;
          case 'bot_detected':
            setErrorMessage(t('contact.form.botDetected'));
            break;
          case 'recaptcha_failed':
            setErrorMessage(t('contact.form.recaptchaFailed'));
            break;
          case 'validation_error':
            setErrorMessage(t('contact.form.validationError'));
            break;
          default:
            setErrorMessage(t('contact.form.error'));
        }
      }
    } catch {
      setStatus('error');
      setErrorMessage(t('contact.form.error'));
    }
  };

  if (status === 'success') {
    return (
      <div
        className="p-8 glass-card text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-lg font-semibold text-nord-14">
          {t('contact.form.success')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => !isLoaded && load()}
      className="p-8 glass-card space-y-6"
      noValidate
    >
      {/* Honeypot field - hidden from users */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="favorite_color">Favorite Color</label>
        <input
          type="text"
          id="favorite_color"
          name="favorite_color"
          value={formData.favorite_color}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-nord-0 dark:text-nord-6 mb-2"
        >
          {t('contact.form.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('contact.form.namePlaceholder')}
          required
          minLength={2}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-nord-1 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 placeholder:text-nord-3 dark:placeholder:text-nord-4 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:border-transparent transition-all disabled:opacity-50"
        />
        {fieldErrors.name && (
          <p
            id="name-error"
            className="mt-1 text-sm text-nord-11"
            role="alert"
          >
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-nord-0 dark:text-nord-6 mb-2"
        >
          {t('contact.form.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('contact.form.emailPlaceholder')}
          required
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-nord-1 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 placeholder:text-nord-3 dark:placeholder:text-nord-4 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:border-transparent transition-all disabled:opacity-50"
        />
        {fieldErrors.email && (
          <p
            id="email-error"
            className="mt-1 text-sm text-nord-11"
            role="alert"
          >
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-nord-0 dark:text-nord-6 mb-2"
        >
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('contact.form.messagePlaceholder')}
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-nord-1 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 placeholder:text-nord-3 dark:placeholder:text-nord-4 focus:outline-none focus:ring-2 focus:ring-nord-10 focus:border-transparent transition-all resize-none disabled:opacity-50"
        />
        {fieldErrors.message && (
          <p
            id="message-error"
            className="mt-1 text-sm text-nord-11"
            role="alert"
          >
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <div
          className="p-4 rounded-xl bg-nord-11/10 border border-nord-11/20 text-nord-11"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 rounded-full font-semibold bg-nord-btn text-white hover:bg-nord-btn-hover hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-nord-8 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 cursor-pointer"
      >
        {status === 'loading'
          ? t('contact.form.sending')
          : t('contact.form.submit')}
      </button>
    </form>
  );
}

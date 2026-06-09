'use client';

import { useState, FormEvent } from 'react';
import { useRecaptcha } from '@tulikettu/ui';
import { useTranslation } from '@/hooks/use-translation';

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

const FIELD_CLASS =
  'w-full px-[14px] py-3 rounded-xl bg-surface-el border border-input text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20 transition-all disabled:opacity-50';
const LABEL_CLASS = 'block text-[13px] font-semibold text-fg-muted mb-2';

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
        className="bg-surface border border-surface-hi/55 rounded-3xl p-8 md:p-9 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="text-4xl mb-4">✓</div>
        <p className="text-lg font-semibold text-ok">
          {t('contact.form.success')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => !isLoaded && load()}
      className="bg-surface border border-surface-hi/55 rounded-3xl p-8 md:p-9"
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-fg">
          {t('contact.form.cardTitle')}
        </h2>
        <p className="text-[14.5px] text-fg-muted mt-1.5">
          {t('contact.form.responseTime')}
        </p>
      </div>

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

      <div className="space-y-[18px]">
        {/* Name field */}
        <div>
          <label htmlFor="name" className={LABEL_CLASS}>
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
            className={FIELD_CLASS}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1 text-sm text-err" role="alert">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
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
            className={FIELD_CLASS}
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-err" role="alert">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className={LABEL_CLASS}>
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
            className={`${FIELD_CLASS} min-h-[130px] resize-y`}
          />
          {fieldErrors.message && (
            <p id="message-error" className="mt-1 text-sm text-err" role="alert">
              {fieldErrors.message[0]}
            </p>
          )}
        </div>

        {/* Error message */}
        {status === 'error' && errorMessage && (
          <div
            className="p-4 rounded-xl bg-err/10 border border-err/20 text-err"
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
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-accent text-on-accent hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          {status === 'loading' ? (
            t('contact.form.sending')
          ) : (
            <>
              {t('contact.form.submit')}
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

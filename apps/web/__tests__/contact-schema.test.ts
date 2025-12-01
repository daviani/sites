/* eslint-env jest */
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';

describe('Contact Schema', () => {
  describe('valid inputs', () => {
    it('accepts valid contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const result = contactSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('accepts minimum valid values', () => {
      const minData = {
        name: 'Jo',
        email: 'a@b.co',
        message: 'Hello test',
      };

      const result = contactSchema.safeParse(minData);

      expect(result.success).toBe(true);
    });

    it('accepts maximum message length', () => {
      const maxData = {
        name: 'John',
        email: 'john@example.com',
        message: 'a'.repeat(2000),
      };

      const result = contactSchema.safeParse(maxData);

      expect(result.success).toBe(true);
    });

    it('trims whitespace from inputs', () => {
      const dataWithSpaces = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  Hello world  ',
      };

      const result = contactSchema.safeParse(dataWithSpaces);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.message).toBe('Hello world');
      }
    });
  });

  describe('name validation', () => {
    it('rejects empty name', () => {
      const result = contactSchema.safeParse({
        name: '',
        email: 'john@example.com',
        message: 'Test message',
      });

      expect(result.success).toBe(false);
    });

    it('rejects name with only whitespace', () => {
      const result = contactSchema.safeParse({
        name: '   ',
        email: 'john@example.com',
        message: 'Test message',
      });

      expect(result.success).toBe(false);
    });

    it('rejects name shorter than 2 characters', () => {
      const result = contactSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        message: 'Test message',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('rejects empty email', () => {
      const result = contactSchema.safeParse({
        name: 'John',
        email: '',
        message: 'Test message',
      });

      expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        'missing@tld',
        '@nodomain.com',
        'spaces in@email.com',
        'double..dots@email.com',
      ];

      invalidEmails.forEach((email) => {
        const result = contactSchema.safeParse({
          name: 'John',
          email,
          message: 'Test message',
        });

        expect(result.success).toBe(false);
      });
    });

    it('accepts valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'user.name@domain.com',
        'user+tag@example.org',
        'user@subdomain.domain.com',
      ];

      validEmails.forEach((email) => {
        const result = contactSchema.safeParse({
          name: 'John',
          email,
          message: 'Test message',
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe('message validation', () => {
    it('rejects empty message', () => {
      const result = contactSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        message: '',
      });

      expect(result.success).toBe(false);
    });

    it('rejects message shorter than 10 characters', () => {
      const result = contactSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        message: 'Too short',
      });

      expect(result.success).toBe(false);
    });

    it('rejects message longer than 2000 characters', () => {
      const result = contactSchema.safeParse({
        name: 'John',
        email: 'john@example.com',
        message: 'a'.repeat(2001),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('type exports', () => {
    it('ContactFormData type matches schema output', () => {
      const data: ContactFormData = {
        name: 'John',
        email: 'john@example.com',
        message: 'Test message!',
      };

      const result = contactSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

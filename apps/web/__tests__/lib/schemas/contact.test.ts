import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/schemas/contact';

const validData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, this is a test message.',
};

describe('contactSchema', () => {
  describe('name field', () => {
    it('accepts a valid name with 2+ characters', () => {
      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects a name shorter than 2 characters', () => {
      const result = contactSchema.safeParse({ ...validData, name: 'J' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 caractères');
      }
    });

    it('rejects an empty name', () => {
      const result = contactSchema.safeParse({ ...validData, name: '' });
      expect(result.success).toBe(false);
    });

    it('trims whitespace before validation', () => {
      const result = contactSchema.safeParse({ ...validData, name: '  J  ' });
      expect(result.success).toBe(false); // trimmed length is 1
    });
  });

  describe('email field', () => {
    it('accepts a valid email', () => {
      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('rejects an invalid email', () => {
      const result = contactSchema.safeParse({ ...validData, email: 'not-an-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email invalide');
      }
    });

    it('rejects an empty email', () => {
      const result = contactSchema.safeParse({ ...validData, email: '' });
      expect(result.success).toBe(false);
    });

    it('trims whitespace before validation', () => {
      const result = contactSchema.safeParse({ ...validData, email: ' john@example.com ' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });
  });

  describe('message field', () => {
    it('accepts a message between 10 and 2000 characters', () => {
      const result = contactSchema.safeParse({ ...validData, message: 'a'.repeat(10) });
      expect(result.success).toBe(true);
    });

    it('rejects a message shorter than 10 characters', () => {
      const result = contactSchema.safeParse({ ...validData, message: 'short' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 caractères');
      }
    });

    it('rejects a message longer than 2000 characters', () => {
      const result = contactSchema.safeParse({ ...validData, message: 'a'.repeat(2001) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2000 caractères');
      }
    });

    it('trims whitespace before validation', () => {
      const result = contactSchema.safeParse({ ...validData, message: '   short   ' });
      expect(result.success).toBe(false); // trimmed = 5 chars
    });
  });

  describe('type inference', () => {
    it('returns typed data on successful parse', () => {
      const result = contactSchema.parse(validData);
      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message.',
      });
    });
  });
});

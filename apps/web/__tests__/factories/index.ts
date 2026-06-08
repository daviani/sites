/**
 * Factory for contact form data
 */
export function createContactFormData(overrides: Partial<{
  name: string;
  email: string;
  message: string;
  favorite_color: string;
}> = {}) {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message content',
    favorite_color: '', // honeypot field - should always be empty
    ...overrides,
  };
}

/**
 * Factory for article meta data
 */
export function createArticleMeta(overrides: Partial<{
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  draft: boolean;
}> = {}) {
  return {
    slug: 'test-article',
    titleFr: 'Article de test',
    titleEn: 'Test Article',
    excerptFr: 'Un extrait de test',
    excerptEn: 'A test excerpt',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['test', 'article'],
    draft: false,
    ...overrides,
  };
}

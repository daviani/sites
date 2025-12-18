import { config, collection, fields, LocalConfig, GitHubConfig } from '@keystatic/core';

/**
 * Storage configuration based on environment:
 * - Development: local storage (no auth needed, easy for contributors)
 * - Production: GitHub storage with OAuth (only repo owner can edit)
 */
const storage: LocalConfig['storage'] | GitHubConfig['storage'] =
  process.env.NODE_ENV === 'development'
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'daviani/daviani.dev',
      };

export default config({
  storage,
  collections: {
    posts: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
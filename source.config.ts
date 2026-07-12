import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      section: z.string(),
      sectionTitle: z.string(),
      sectionOrder: z.number().int().positive(),
      order: z.number().int().positive(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    remarkStructureOptions: {
      types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'code'],
    },
  },
});

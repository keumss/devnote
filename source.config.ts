import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: false,
    remarkStructureOptions: {
      types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'code'],
    },
  },
});

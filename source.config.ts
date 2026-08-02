import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content',
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'one-light',
        dark: 'one-dark-pro',
      },
      addLanguageClass: true,
      icon: false,
    },
    remarkStructureOptions: {
      types: ['heading', 'paragraph', 'blockquote', 'tableCell', 'code'],
    },
  },
});

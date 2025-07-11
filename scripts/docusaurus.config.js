// @ts-check
// Docusaurus config: see https://docusaurus.io/docs/api/docusaurus-config

const config = {
  title: 'K-12 Lesson Plan App',
  tagline: 'Inclusive, privacy-first lesson planning',
  url: 'https://your-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'rituzangle', // GitHub org/user
  projectName: 'lesson-plan-app', // Repo name

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/rituzangle/lesson-plan-app/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/rituzangle/lesson-plan-app/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Lesson Plan App',
      logo: {
        alt: 'App Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/docs/intro', label: 'Docs', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/rituzangle/lesson-plan-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Docs', items: [{ label: 'Project Guide', to: '/docs/project_guide' }] },
        { title: 'Community', items: [{ label: 'GitHub', href: 'https://github.com/rituzangle/lesson-plan-app' }] },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ritu Sangha`,
    },
  },
};

module.exports = config;

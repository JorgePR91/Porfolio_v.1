
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/contact"
  },
  {
    "renderMode": 2,
    "route": "/about-me"
  },
  {
    "renderMode": 2,
    "route": "/goals"
  },
  {
    "renderMode": 2,
    "route": "/projects"
  },
  {
    "renderMode": 2,
    "route": "/skills"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 17725, hash: '1acc40fcd449117f96b6c9ffcbb47bfd53e022876d32a5767720e866ef85efa5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 11491, hash: 'be383ff1c76e7e5179b20748dd36882b8da730aedc5d5d29d9a2d69920ff6f3d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'about-me/index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/about-me_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'projects/index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/projects_index_html.mjs').then(m => m.default)},
    'goals/index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/goals_index_html.mjs').then(m => m.default)},
    'index.html': {size: 41562, hash: '37b7d25050196f8bc27ea0f43558e251c1b37fa098225c977dbd6cd6389b8c3e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-PRURICZH.css': {size: 10614, hash: 'c2qTjqGPRa4', text: () => import('./assets-chunks/styles-PRURICZH_css.mjs').then(m => m.default)}
  },
};

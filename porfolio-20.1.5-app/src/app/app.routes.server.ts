import { ServerRoute, RenderMode } from '@angular/ssr';

// Server routes should only declare the path and renderMode.
// Component associations remain in the client-side `app.routes.ts`.
export const serverRoutes: ServerRoute[] = [
  { path: 'contact', renderMode: RenderMode.Server },
  { path: 'about-me', renderMode: RenderMode.Server },
  { path: 'goals', renderMode: RenderMode.Server },
  { path: 'projects', renderMode: RenderMode.Server },
  { path: 'skills', renderMode: RenderMode.Server },
  { path: '', renderMode: RenderMode.Server },
];
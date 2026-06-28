import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { REQUEST } from '@angular/core';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: REQUEST,
      useFactory: () => {
        return null;
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

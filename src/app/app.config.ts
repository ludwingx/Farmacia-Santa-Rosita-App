import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { addTokenInterceptor } from './core/interceptors/add-token.interceptor';
import { demoDataInterceptor } from './core/interceptors/demo-data.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),           
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([addTokenInterceptor, demoDataInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
  ],
};

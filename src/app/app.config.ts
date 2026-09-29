import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { addTokenInterceptor } from './core/interceptors/add-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),           
    provideClientHydration(),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
  ],
};

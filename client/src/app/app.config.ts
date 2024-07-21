import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import {  provideNativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([jwtInterceptor, loadingInterceptor])), provideAnimationsAsync(),provideAnimations(), provideToastr({
    positionClass: 'toast-bottom-right',
  }),
  provideNativeDateAdapter(),
  importProvidersFrom(NgxSpinnerModule)
  ]
};

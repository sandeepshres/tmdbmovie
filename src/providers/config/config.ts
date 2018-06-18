
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiEndpoint: string;
  apiKey: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'https://api.themoviedb.org/3',
  apiKey: '8dbbb72ffc70a288ba57e27b8719cca3'
};

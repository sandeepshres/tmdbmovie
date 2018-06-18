import { MovieProvider } from '../../providers/movie/movie';
import { NetworkProvider } from '../../providers/network/network';
import { APP_CONFIG, APP_DI_CONFIG } from '../../providers/config/config';
import { MovieDetailPage } from './moviedetail/moviedetail';
import { MoviesPage } from './movies';

import { IonicPageModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    MoviesPage,
    MovieDetailPage
  ],
  imports: [
    IonicPageModule.forChild(MoviesPage),
    HttpModule
  ],
  entryComponents: [
    MoviesPage,
    MovieDetailPage
  ],
  providers: [
    { provide: APP_CONFIG, useValue: APP_DI_CONFIG},
    MovieProvider,
    NetworkProvider
  ]
})
export class MoviesModule {}


//provide: BASE_URL, useValue: 'http://localhost'}

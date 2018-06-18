import { MovieProvider } from './../../../providers/movie/movie';
import { NetworkProvider } from '../../../providers/network/network';
import { Movie } from './../../../interface/movie';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'moviedetail',
  templateUrl: 'moviedetail.html'
})
export class MovieDetailPage implements OnDestroy {

  movie: Movie;
  private movieSub: Subscription;
  constructor(
    private navParams: NavParams,
    private movieProvider: MovieProvider,
    private networkProvider: NetworkProvider
  ) {
  }

  ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.movieSub = this.movieProvider.getMovieDetails(id)
      .subscribe(movie => this.movie = movie);
  }

  ionViewDidEnter() {
    this.networkProvider.disconSubscribe();
    if (!this.networkProvider.isConnected()) {
      this.networkProvider.presentToast();
    }
  }

  ionViewWillLeave() {
    this.networkProvider.disconUnsubscribe();
  }

  doRefresh(refresher) {
    this.ngOnDestroy();
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 800);
    if (!this.networkProvider.isConnected()) {
      this.networkProvider.presentToast();
    }
  }

  public ngOnDestroy(): void {
    if (this.movieSub) {
      this.movieSub.unsubscribe();
    }
  }
}

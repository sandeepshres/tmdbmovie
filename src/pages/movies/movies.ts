import { Movie } from '../../interface/movie';
import { MovieProvider } from '../../providers/movie/movie';
import { NetworkProvider } from '../../providers/network/network';
import { MovieDetailPage } from './moviedetail/moviedetail';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { Subject, Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';




/**
 * Add this in order to enable lazy loading
 */
@IonicPage()
@Component({
  selector: 'page-movies',
  templateUrl: 'movies.html',
})
export class MoviesPage implements OnDestroy {

  movieSearch$: Subject<string> = new Subject<string>();
  movieSelection = 'now_playing';
  endPages: boolean = false;
  movies: Movie[] = [];
  private lastSearch: string;
  private page: number = 0;
  private subscription: Subscription;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private movieProvider: MovieProvider,
    private networkProvider: NetworkProvider
  ) { }

  getSelection(selection: string) {
    this.reset();
    this.movieSearch$.next(selection);
  }

  private reset() {
    this.page = 0;
    this.movies = [];
    this.endPages = false;
    this.content.scrollToTop(200);
  }

  searchMovie(search: string) {
    this.reset();
    this.movieSearch$.next(search);
  }

  ionViewDidLoad() {
    this.subscription = this.movieSearch$
      .debounceTime(400)
      .switchMap((search: string) => {
        search = !!!search ? this.movieSelection : search;
        const searchOpt: boolean =
          search === 'now_playing' ||
            search === 'upcoming' ||
            !!!search
            ? true
            : false;
        this.lastSearch = search;
        this.page++;
        if (searchOpt) {
          return this.movieProvider.getList(search, this.page.toString());
        } else {
          return this.movieProvider.searchMovie(search, this.page.toString());
        }
      })
      .subscribe((movies: Movie[]) => {
        this.movies = this.movies.concat(movies);
        if (movies.length === 0) {
          this.endPages = true;
        }
      });
    setTimeout(() => this.movieSearch$.next(''), 1000);
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

  goToDetails(id: string) {
    this.navCtrl.push(MovieDetailPage, { id: id });
  }

  doInfinite(infiniteScroll) {
    this.movieSearch$.next(this.lastSearch);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 800);
    if (!this.networkProvider.isConnected()) {
      this.networkProvider.presentToast();
    }
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

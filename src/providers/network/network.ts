import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription} from 'rxjs/Subscription';
/*
  Generated class for the NativefunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {
  disconnected: Subscription;
  constructor(public toastCtrl: ToastController,
  public network: Network) {
  }

  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'No internet connection.',
    duration: 2000,
    position: 'bottom',
    cssClass: 'toastClass',
    dismissOnPageChange: false
  });
  toast.present();
  }

  isConnected(): boolean {
      let contype = this.network.type;
      return contype && contype !== 'unknown' && contype !== 'none';
  }

  disconSubscribe() {
      this.disconnected = this.network.onDisconnect().subscribe(() => {
      this.presentToast();
     });
  }

  disconUnsubscribe() {
    this.disconnected.unsubscribe();
  }

}

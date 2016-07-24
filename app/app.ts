import { Component } from '@angular/core';
import { Platform , ionicBootstrap} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { provideStore } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';

import reducer from './reducers';
import actions from './actions';
import services from './services';

import { WelcomePage } from './pages/welcome';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = WelcomePage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [
  provideStore(reducer),
  services,
  actions
]);

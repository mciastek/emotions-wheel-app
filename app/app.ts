import { Component } from '@angular/core';
import { Platform , ionicBootstrap} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { WelcomePage } from './pages/welcome/welcome';

import { AuthService } from './services/auth.service';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [AuthService]
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

ionicBootstrap(MyApp);

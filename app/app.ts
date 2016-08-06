import { PLATFORM_PIPES, Component } from '@angular/core';
import { HTTP_PROVIDERS ,Http } from '@angular/http';
import { Platform , ionicBootstrap} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { provideStore } from '@ngrx/store';
import { TranslatePipe, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import config from './config';

import reducer from './reducers';
import actions from './actions';
import services from './services';

import { PhotoPreview } from './containers';

import { WelcomePage } from './pages/welcome';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav><photo-preview></photo-preview>',
  directives: [PhotoPreview],
  providers: [
    {
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'build/assets/i18n', '.json'),
      deps: [Http]
    },
    TranslateService
  ]
})
export class MyApp {

  private rootPage: any;
  private language: string;

  constructor(private platform: Platform, private translate: TranslateService) {
    this.rootPage = WelcomePage;

    translate.setDefaultLang('en');

    this.setLanguage();

    translate.use(this.language);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  private setLanguage() {
    const userLang = navigator.language.split('-')[0];
    const langRegex = new RegExp(`(${config.languages.join('|')})`, 'gi');

    this.language = langRegex.test(userLang) ? userLang : 'en';
  }
}

ionicBootstrap(MyApp, [
  HTTP_PROVIDERS,
  {
    provide: PLATFORM_PIPES, useValue: TranslatePipe, multi: true
  },
  provideStore(reducer),
  services,
  actions
]);

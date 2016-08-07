import { Injectable } from '@angular/core';

import { Loading } from 'ionic-angular';

@Injectable()
export class LoaderService {
  public loader: Loading;

  create(message) {
    this.loader = Loading.create({
      content: message
    });
  }

  show(navController) {
    navController.present(this.loader);
  }

  dismiss() {
    this.loader.dismiss();
  }
}

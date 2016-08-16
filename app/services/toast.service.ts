import { Injectable } from '@angular/core';

import { NavController, Toast } from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(private nav: NavController) {}

  show(message) {
    const toast = Toast.create({
      message: message,
      position: 'bottom',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });

    this.nav.present(toast);
  }
}

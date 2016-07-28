import { Injectable } from '@angular/core';

import { NavController, Toast } from 'ionic-angular';

@Injectable()
export class ToastService {
  private toast: Toast;
  constructor(private navController: NavController) {}

  show(message) {
    this.toast = Toast.create({
      message: message,
      position: 'bottom',
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
      dismissOnPageChange: true
    });

    this.navController.present(this.toast);
  }
}

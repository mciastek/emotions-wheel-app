import { Component } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/welcome/welcome.html',
})
export class WelcomePage {

  constructor(private nav: NavController) {

  }

  errorToast(message) {
    return Toast.create({
      message: message,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
  }

  turnScanner() {
    BarcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData)
    }, (err) => {
      this.nav.present(this.errorToast(err));
    });
  }

}

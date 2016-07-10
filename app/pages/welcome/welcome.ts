import { Component, OnInit } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import { AuthService } from '../../services/auth.service';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage implements OnInit {
  public barcode: String

  constructor(private nav: NavController, private authService: AuthService) {

  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authenticateWithToken(token);
    }
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
    BarcodeScanner.scan()
      .then(this.scanSuccess.bind(this))
      .catch(this.scanError.bind(this));
  }

  scanSuccess({ text }) {
    if (text) {
      this.authenticateWithToken(text);
    } else {
      this.nav.present(this.errorToast('QR code is invalid'));
    }
  }

  scanError(err) {
    this.nav.present(this.errorToast(err));
  }

  authenticateWithToken(token) {
    this.authService.authenticate(token)
      .subscribe(() => {
        localStorage.setItem('token', token);
        this.nav.push(HomePage);
      }, (err) => {
        this.nav.present(this.errorToast(err))
      });
  }

}

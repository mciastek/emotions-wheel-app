import { Component, Output, EventEmitter } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';

@Component({
  selector: 'general-welcome',
  templateUrl: 'build/components/general-welcome/template.html'
})
export class GeneralWelcomeComponent {
  @Output() scanSuccess = new EventEmitter();
  @Output() scanError = new EventEmitter();

  turnScanner() {
    BarcodeScanner.scan()
      .then(this.onScanSuccess.bind(this))
      .catch(this.onScanError.bind(this));
  }

  onScanSuccess({ text }) {
    this.scanSuccess.emit({
      token: text
    });
  }

  onScanError(err) {
    this.scanError.emit(err);
  }
}

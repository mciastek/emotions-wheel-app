import { Component, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'board-overlay',
  templateUrl: 'build/containers/board-overlay/template.html',
})
export class BoardOverlay {
  @Output() closeClicked = new EventEmitter;

  buttonClick(e) {
    this.closeClicked.emit(e);
  }
}

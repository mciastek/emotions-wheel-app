import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscribable } from 'rxjs/Observable';

import { BoardOverlayState } from '../../models/ui';
import { AppState, getBoardOverlay } from '../../reducers';
import { UIActions } from '../../actions';

@Component({
  selector: 'board-overlay',
  templateUrl: 'build/containers/board-overlay/template.html',
})
export class BoardOverlay {
  el: HTMLElement;
  public boardOverlay$: Observable<BoardOverlayState>;

  @Output() closeClicked = new EventEmitter;

  constructor(
    el: ElementRef,
    private uiActions: UIActions,
    private store: Store<AppState>
  ) {
    this.el = el.nativeElement;

    this.boardOverlay$ = this.store.let(getBoardOverlay());

    this.boardOverlay$.subscribe((state) => {
      if (state.isVisible) {
        this.el.classList.add('is-visible');
      } else {
        this.el.classList.remove('is-visible');
      }
    });
  }

  buttonClick(e) {
    this.closeClicked.emit(e);
  }
}

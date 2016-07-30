import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Modal, NavController, ViewController } from 'ionic-angular';
import { Observable, Subscribable } from 'rxjs/Observable';

import { PhotoPreviewState } from '../../models/ui';
import { AppState, getPhotoPreview } from '../../reducers';
import { UIActions } from '../../actions';

@Component({
  selector: 'photo-preview',
  templateUrl: 'build/containers/photo-preview/template.html'
})
export class PhotoPreview {
  el: HTMLElement;

  public photoPreviewModal$: Observable<PhotoPreviewState>;
  public photoUrl: string;

  constructor(
    el: ElementRef,
    private uiActions: UIActions,
    private store: Store<AppState>
  ) {
    this.el = el.nativeElement;

    this.photoPreviewModal$ = this.store.let(getPhotoPreview());

    this.photoPreviewModal$.subscribe((state) => {
      if (state.isOpened) {
        this.el.classList.add('is-visible');
        this.updateImage(state.imageUrl);
      } else {
        this.el.classList.remove('is-visible');
        this.updateImage('');
      }
    });
  }

  updateImage(url) {
    const imgElement = this.el.querySelector('img');

    if (imgElement) {
      imgElement.setAttribute('src', url);
    }
  }

  close() {
    this.store.dispatch(this.uiActions.hidePhotoPreview());
  }
}

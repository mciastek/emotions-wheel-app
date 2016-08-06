import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Photo } from '../../models';
import { UIActions } from '../../actions';
import { AppState } from '../../reducers';

import { DoubleTapDirective } from '../../directives';

@Component({
  selector: 'photo-gallery',
  templateUrl: 'build/containers/photo-gallery/template.html',
  directives: [DoubleTapDirective]
})
export class PhotoGallery {
  @Input() photos: Photo[];

  constructor(
    private uiActions: UIActions,
    private store: Store<AppState>
  ) {}

  onDoubleTap(photo) {
    this.store.dispatch(this.uiActions.showPhotoPreview(photo.original));
  }
}

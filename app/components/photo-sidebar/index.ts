import { Component, Input } from '@angular/core';

import { Photo, Rate } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html'
})
export class PhotoSidebarComponent {
  @Input() photos: Photo[];
  @Input() rates: Rate[];

  get remainingPhotos() {
    return this.photos.filter((photo) => {
      return this.rateByPhotos(photo);
    });
  }

  rateByPhotos(photo: Photo) {
    return !this.rates.find((rate) => photo.id === rate.photo_id);
  }
}

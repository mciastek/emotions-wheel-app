import { Component, Input } from '@angular/core';

import { Photo } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html'
})
export class PhotoSidebarComponent {
  @Input() photos: Photo[];

  public remainingPhotos: Photo[];
}

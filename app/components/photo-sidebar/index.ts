import { Component, Input } from '@angular/core';

import { Photo, Rate } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html'
})
export class PhotoSidebarComponent {
  @Input() photos: Photo[];
  @Input() rates: Rate[];
}

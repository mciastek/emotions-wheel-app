import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PhotoGallery } from '../../containers';

@Component({
  templateUrl: 'build/pages/gallery/template.html',
  directives: [PhotoGallery]
})
export class GalleryPage {
  constructor(private nav: NavController) {}

  goBack() {
    this.nav.pop();
  }
}


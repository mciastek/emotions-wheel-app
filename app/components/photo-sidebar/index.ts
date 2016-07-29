import { Component, Input, AfterViewChecked } from '@angular/core';

import { Photo } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html'
})
export class PhotoSidebarComponent implements AfterViewChecked {
  private columns: number;

  @Input() photos: Photo[];

  constructor() {
    this.columns = 4;
  }

  ngAfterViewChecked() {
    this.updatePhotoElementsPosition();
    this.buildPhotosGrid();
  }

  private updatePhotoElementsPosition() {
   this.photos
     .filter(p => !!p.x && !!p.y)
     .forEach((photo) => {
        const photoElement = <HTMLElement>document.querySelector(`[data-photo-id="${photo.id}"]`);

        const x = (photo.x || 0);
        const y = (photo.y || 0);

        photoElement.setAttribute('data-x', x.toString());
        photoElement.setAttribute('data-y', y.toString());
        photoElement.classList.add('in-dropzone');

        photoElement.style.webkitTransform = photoElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
     });
  }

  private buildPhotosGrid() {
    const photoElements = document.querySelectorAll('.photo-item');
    const sidebar = <HTMLElement>document.querySelector('photo-sidebar');

    [].slice.call(photoElements)
      .filter(el => !el.classList.contains('in-dropzone'))
      .forEach((photoElement, index) => {
        const coords = this.getCoordsByIndex(photoElement, index);

        const x = coords.x + sidebar.offsetLeft;
        const y = coords.y + sidebar.offsetTop;

        photoElement.setAttribute('data-x', x.toString());
        photoElement.setAttribute('data-y', y.toString());

        photoElement.style.webkitTransform = photoElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
  }

  private getCoordsByIndex(el, index) {
    const elementRect = el.getBoundingClientRect();

    const x = elementRect.width * (index % this.columns);
    const y = Math.floor(index / this.columns) * elementRect.height;

    return { x, y };
  }
}

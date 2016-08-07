import { Component, Input, Output, EventEmitter, AfterViewChecked } from '@angular/core';

import { Photo } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html'
})
export class PhotoSidebarComponent implements AfterViewChecked {
  private columns: number;
  private padding: number;

  @Input() photos: Photo[];
  @Input() showGalleryButton: boolean;
  @Output() galleryButtonClick = new EventEmitter();

  constructor() {
    this.columns = 4;
    this.padding = 5;
  }

  ngAfterViewChecked() {
    this.updatePhotoElementsPosition();
    this.buildPhotosGrid();
  }

  buttonClick(e) {
    this.galleryButtonClick.emit(e);
  }

  private updatePhotoElementsPosition() {
   this.photos
     .filter(p => !!p.x && !!p.y)
     .forEach((photo) => {
        const photoElement = <HTMLElement>document.querySelector(`[data-photo-id="${photo.id}"]`);

        const x = (photo.x || 0);
        const y = (photo.y || 0);

        if (!photoElement) return;

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

    const hm = index % this.columns;
    const vm = Math.floor(index / this.columns);

    const x = (hm * elementRect.width) + ((hm + 1) * this.padding);
    const y = (vm * elementRect.height) + ((vm + 1) * this.padding);

    return { x, y };
  }
}

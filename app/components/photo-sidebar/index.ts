import { Component, ElementRef, Input, Output, EventEmitter, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';

import { Photo } from '../../models';

import { DraggableService } from '../../services';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoSidebarComponent implements AfterViewChecked {
  private el: HTMLElement;
  private columns: number;
  private padding: number;

  private scrollH: number;
  private scrollLimit: number;
  private scrollPosition: number;

  public navigationVisible: boolean;
  public disableUp: boolean;
  public disableDown: boolean;

  @Input() photos: Photo[];
  @Input() showGalleryButton: boolean;
  @Output() galleryButtonClick = new EventEmitter();

  constructor(
    el: ElementRef
  ) {
    this.el = el.nativeElement;

    this.columns = 2;
    this.padding = 5;
    this.scrollH = 0;
    this.scrollLimit = 0;
    this.scrollPosition = 0;

    this.navigationVisible = false;
    this.disableUp = false;
    this.disableDown = true;
  }

  ngAfterViewChecked() {
    this.updateSidebarView();
  }

  buttonClick(e) {
    this.galleryButtonClick.emit(e);
  }

  get photosInSidebar() {
    const photoElements = this.el.querySelectorAll('.photo-item');
    return [].slice.call(photoElements).filter(el => !el.classList.contains('in-dropzone'));
  }

  public updateSidebarView() {
    this.updatePhotoElementsPosition();
    this.buildPhotosGrid();
    this.checkScrollNavigation();
  }

  public scrollPhotos(direction) {
    const firstPhotoElement = this.el.querySelector('.photo-item');
    const moveY = firstPhotoElement.getBoundingClientRect().height + this.padding;

    this.scrollPosition += direction;
    this.scrollH += moveY * direction;

    this.disableUp = this.scrollPosition < 0 && Math.abs(this.scrollPosition) === this.scrollLimit;
    this.disableDown = this.scrollPosition === 0;
  }

  private checkScrollNavigation() {
    const photoElements = this.photosInSidebar;
    const buttonElement = this.el.querySelector('.photo-sidebar__button');

    if (photoElements.length === 0) return;

    const photoElementRect = photoElements[0].getBoundingClientRect();
    const sidebarRect = this.el.getBoundingClientRect();
    const buttonHeight = (buttonElement) ? buttonElement.getBoundingClientRect().height : 0;

    const lastPhotoElementCoords = this.getCoordsByIndex(photoElements[photoElements.length - 1], photoElements.length - 1);
    const photoElementsTotalHeight = lastPhotoElementCoords.y + photoElementRect.height;
    const availableVerticalSpace = sidebarRect.height - buttonHeight;

    this.scrollLimit = Math.ceil((photoElementsTotalHeight - availableVerticalSpace) / photoElementRect.height);
    this.navigationVisible = photoElementsTotalHeight > availableVerticalSpace;
  }

  private updatePhotoElementsPosition() {
    this.photos
     .filter(p => typeof p.x !== 'undefined' && typeof p.y !== 'undefined')
     .forEach((photo) => {
        const photoElement = <HTMLElement>document.querySelector(`[data-photo-id="${photo.id}"]`);
        const photoElementRect = photoElement.getBoundingClientRect();

        if (!photoElement) return;

        const x = (photo.x || 0) - photoElementRect.width / 2;
        const y = (photo.y || 0) - photoElementRect.height / 2;

        photoElement.setAttribute('data-x', x.toString());
        photoElement.setAttribute('data-y', y.toString());
        photoElement.classList.add('in-dropzone');

        photoElement.style.webkitTransform = photoElement.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.5)`;
     });
  }

  private buildPhotosGrid() {
    const sidebar = this.el;

    this.photosInSidebar
      .forEach((photoElement, index) => {
        const coords = this.getCoordsByIndex(photoElement, index);

        const x = coords.x + sidebar.offsetLeft;
        const y = (coords.y + sidebar.offsetTop) + this.scrollH;

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

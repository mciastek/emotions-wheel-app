import { Component, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Photo } from '../../models';

@Component({
  selector: 'photo-sidebar',
  templateUrl: 'build/components/photo-sidebar/template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoSidebarComponent implements OnInit, AfterViewChecked {
  private el: HTMLElement;

  public remainingPhotos: number;

  @Input() photos: Photo[];
  @Input() showGalleryButton: boolean;
  @Input() hideRatedPhotos: boolean;
  @Output() galleryButtonClick = new EventEmitter();

  constructor(
    el: ElementRef,
    private translate: TranslateService
  ) {
    this.el = el.nativeElement;
    this.remainingPhotos = 0;
  }

  ngOnInit() {
    if (this.hideRatedPhotos) {
      this.el.classList.add('photo-sidebar--hidden-photos');
    }
  }

  ngAfterViewChecked() {
    this.updateSidebarView();
  }

  buttonClick(e) {
    this.galleryButtonClick.emit(e);
  }

  get photosInSidebar() {
    const photoElements = this.el.querySelectorAll('.photo-item');
    return [].slice.call(photoElements).filter(el => !el.classList.contains('in-dropzone') && !el.classList.contains('is-dragged'));
  }

  public updateSidebarView() {
    this.updatePhotoElementsPosition();
    this.buildPhotosGrid();
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

        photoElement.style.webkitTransform = photoElement.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.4)`;
     });
  }

  private buildPhotosGrid() {
    const sidebar = this.el;
    const sidebarRect = this.el.getBoundingClientRect();
    const buttonElement = this.el.querySelector('.photo-sidebar__button');
    const buttonElementHeight = (buttonElement) ? buttonElement.getBoundingClientRect().height : 0;

    this.photosInSidebar
      .forEach((photoElement, index) => {
        if (index > 0) {
          photoElement.classList.add('is-hidden');
        } else {
          photoElement.classList.remove('is-hidden');
        }

        const photoElementRect = photoElement.getBoundingClientRect();

        const x = sidebarRect.left + (sidebarRect.width / 2 - photoElementRect.width / 2);
        const y = (sidebarRect.height / 2 - photoElementRect.height / 2) - buttonElementHeight;

        photoElement.setAttribute('data-x', x.toString());
        photoElement.setAttribute('data-y', y.toString());

        photoElement.style.webkitTransform = photoElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      });

    this.remainingPhotos = this.photosInSidebar.length;
  }
}

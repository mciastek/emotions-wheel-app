import { Injectable } from '@angular/core';
import * as interact from 'interact.js';

import { Content } from 'ionic-angular';

@Injectable()
export class DraggableService {
  private interact;
  private draggableSelector: string;
  private dropZoneSelector: string;
  private dropzone: HTMLElement;

  public onDragStart: Function;
  public onDragEnd: Function;
  public onDrop: Function;
  public onDraggableDoubleTap: Function;

  public contentView: Content;

  constructor() {}

  init(dropZoneSelector, draggableSelector, params?) {
    this.interact = interact;
    this.draggableSelector = draggableSelector;
    this.dropZoneSelector = dropZoneSelector;

    if (params) {
      this.onDragStart = params.onDragStart;
      this.onDragEnd = params.onDragEnd;
      this.onDrop = params.onDrop;
      this.contentView = params.contentView;
      this.onDraggableDoubleTap = params.onDraggableDoubleTap;
    }

    this.enable();
  }

  enable() {
    this.setDraggable();
    this.setDropZone();
  }

  draggablePosition(draggable: HTMLElement) {
    const contentDimensions = this.contentView.getContentDimensions();

    const draggableCoords = {
      top: draggable.getBoundingClientRect().top + contentDimensions.scrollTop,
      left: draggable.getBoundingClientRect().left + contentDimensions.scrollLeft,
    };

    return {
      x: Math.abs(this.dropzoneDimensions.left - draggableCoords.left) / this.dropzoneDimensions.width,
      y: Math.abs(this.dropzoneDimensions.top - draggableCoords.top) / this.dropzoneDimensions.height,
    };
  }

  reversedDraggablePosition(position) {
    return {
      x: (position.x * this.dropzoneDimensions.width),
      y: (position.y * this.dropzoneDimensions.height)
    };
  }

  private get dropzoneDimensions() {
    const contentDimensions = this.contentView.getContentDimensions();
    const dropzoneRect = this.dropzone.getBoundingClientRect();

    return {
      top: dropzoneRect.top + contentDimensions.scrollTop,
      left: dropzoneRect.left + contentDimensions.scrollLeft,
      width: dropzoneRect.width,
      height: dropzoneRect.height,
    };
  }

  private setDraggable() {
    this.interact(this.draggableSelector)
      .draggable({
        inertia: true,
        restrict: {
          restriction: document.querySelector(this.dropZoneSelector),
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onstart: this.onDragStart,
        onmove: this.updateDraggablePosition,
        onend: this.onDragEnd
      });

    if (this.onDraggableDoubleTap) {
      this.interact(this.draggableSelector)
        .on('doubletap', this.onDraggableDoubleTap);
    }
  }

  private setDropZone() {
    this.interact(this.dropZoneSelector)
      .dropzone({
        accept: this.draggableSelector,
        ondrop: this.onDrop
      });

    this.dropzone = <HTMLElement>document.querySelector(this.dropZoneSelector);
  }

  private updateDraggablePosition(event) {
    const target = event.target;

    const x = (parseFloat(target.getAttribute('data-x')) || '0') + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || '0') + event.dy;

    target.style.webkitTransform = target.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
}

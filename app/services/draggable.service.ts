import { Injectable } from '@angular/core';
import * as interact from 'interact.js';

@Injectable()
export class DraggableService {
  private interact;
  private draggableSelector: string;
  private dropZoneSelector: string;

  constructor() {}

  init(dropZoneSelector, draggableSelector) {
    this.interact = interact;
    this.draggableSelector = draggableSelector;
    this.dropZoneSelector = dropZoneSelector;

    this.enable();
  }

  enable() {
    this.setDraggable();
    this.setDropZone();
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
        onmove: this.updateDraggablePosition
      });
  }

  private updateDraggablePosition(event) {
    const target = event.target,

    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform = target.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  private setDropZone() {
    this.interact(this.dropZoneSelector)
      .dropzone({
        accept: this.draggableSelector
      });
  }
}

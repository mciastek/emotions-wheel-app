import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';

declare var Hammer: any;

@Directive({
    selector: '[longPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  longPressGesture: Gesture;

  @Output() longPress = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.longPressGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Press, {time: 3000}]
      ]
    });
    this.longPressGesture.listen();

    this.longPressGesture.on('press', (e) => {
      this.longPress.emit(e);
    });
  }

  ngOnDestroy() {
    this.longPressGesture.destroy();
  }
}

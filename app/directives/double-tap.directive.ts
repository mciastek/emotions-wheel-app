import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Gesture } from 'ionic-angular/gestures/gesture';

declare var Hammer: any;

@Directive({
    selector: '[doubleTap]'
})
export class DoubleTapDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  doubleTapGesture: Gesture;

  @Output() doubleTap = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.doubleTapGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Tap, {taps: 2}]
      ]
    });
    this.doubleTapGesture.listen();

    this.doubleTapGesture.on('tap', (e) => {
      this.doubleTap.emit(e);
    });
  }

  ngOnDestroy() {
    this.doubleTapGesture.destroy();
  }
}

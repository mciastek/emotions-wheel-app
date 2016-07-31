import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {  } from 'ionic-angular';

import { Photo, Rate } from '../../models';

import { WheelLabelsComponent } from '../wheel-labels';

@Component({
  selector: 'emotions-wheel',
  templateUrl: 'build/components/emotions-wheel/template.html',
  directives: [WheelLabelsComponent]
})
export class EmotionsWheelComponent implements OnInit {
  private el: HTMLElement;

  @Input() photos: Photo[];
  @Input() rates: Rate[];

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.setWheelHeight();
  }

  private setWheelHeight() {
    const toolbarHeight = 56;
    const wheelSVG = <HTMLElement>this.el.querySelector('svg');

    wheelSVG.style.height = `${window.innerHeight - toolbarHeight}px`;
  }
}

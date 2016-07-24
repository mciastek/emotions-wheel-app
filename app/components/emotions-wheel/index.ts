import { Component, Input } from '@angular/core';

import { Photo, Rate } from '../../models';

import { WheelLabelsComponent } from '../wheel-labels';

@Component({
  selector: 'emotions-wheel',
  templateUrl: 'build/components/emotions-wheel/template.html',
  directives: [WheelLabelsComponent]
})
export class EmotionsWheelComponent {
  @Input() photos: Photo[];
  @Input() rates: Rate[];
}

import { Component } from '@angular/core';

import { WheelLabelsComponent } from '../wheel-labels';

@Component({
  selector: 'emotions-wheel',
  templateUrl: 'build/components/emotions-wheel/template.html',
  directives: [WheelLabelsComponent]
})
export class EmotionsWheelComponent {
  constructor() {}
}

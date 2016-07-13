import { Component, Input } from '@angular/core';

import { Participant, Experiment } from '../../models';

@Component({
  selector: 'experiment-toolbar',
  templateUrl: 'build/components/experiment-toolbar/template.html'
})
export class ExperimentToolbarComponent {
  @Input() participant: Participant;
  @Input() experiment: Experiment;

  get experimentName() {
    return this.experiment.name;
  }

  get participantName() {
    return `${this.participant.first_name} ${this.participant.last_name}`;
  }
}

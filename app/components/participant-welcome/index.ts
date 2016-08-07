import { Component, Input, Output, EventEmitter} from '@angular/core';

import { Participant, Experiment } from '../../models';

@Component({
  selector: 'participant-welcome',
  templateUrl: 'build/components/participant-welcome/template.html'
})
export class ParticipantWelcomeComponent {
  @Input() participant: Participant;
  @Input() experiment: Experiment;

  @Output() startExperiment = new EventEmitter();

  onButtonClick() {
    this.startExperiment.emit({});
  }

  get fullName() {
    return `${this.participant.first_name} ${this.participant.last_name}`;
  }

  get experimentName() {
    return this.experiment.name;
  }

  get experimentModeMessageTranslation() {
    return `welcome.experimentTypeMessage.${this.experiment.kind}`;
  }
}

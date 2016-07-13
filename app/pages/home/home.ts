import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { NavController } from 'ionic-angular';

import { Participant, Experiment } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';

import {
  EmotionsWheelComponent,
  ExperimentToolbarComponent,
  PhotoSidebarComponent
} from '../../components';

@Component({
  templateUrl: 'build/pages/home/home.html',
  directives: [
    EmotionsWheelComponent,
    ExperimentToolbarComponent,
    PhotoSidebarComponent
  ]
})
export class HomePage {
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;

  constructor(private navController: NavController, private store: Store<AppState>) {
    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());
  }
}

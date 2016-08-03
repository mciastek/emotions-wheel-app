import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscribable } from 'rxjs/Observable';

import { NavController } from 'ionic-angular';

import { Participant, Experiment } from '../../models';
import { AppState, getExperiment, getParticipant } from '../../reducers';

import { AuthService } from '../../services/auth.service';

import { WelcomePage } from '../welcome';

@Component({
  templateUrl: 'build/pages/finished/template.html'
})
export class FinishedPage {
  public experiment$: Observable<Experiment>;
  public participant$: Observable<Participant>;

  public experiment: Experiment;
  public participant: Participant;

  constructor(
    private nav: NavController,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());

    this.participant$.subscribe(p => this.participant = p);
    this.experiment$.subscribe(e => this.experiment = e);
  }

  get experimentName() {
    return this.experiment.name;
  }

  get participantName() {
    return this.participant.first_name;
  }

  get hasCompleted() {
    return this.experiment.has_completed && this.experiment.is_active;
  }

  get isInactive() {
    return !this.experiment.is_active;
  }

  startNewExperiment() {
    this.authService.invalidateToken();
    this.nav.push(WelcomePage);
  }
}

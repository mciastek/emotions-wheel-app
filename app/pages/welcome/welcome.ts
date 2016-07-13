import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { NavController, Toast } from 'ionic-angular';

import { AuthService, AuthResponse } from '../../services/auth.service';

import { Participant, Experiment } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';
import { ParticipantActions, ExperimentActions } from '../../actions';

import { ParticipantWelcomeComponent, GeneralWelcomeComponent } from '../../components';

import { HomePage } from '../home/home.ts';

@Component({
  templateUrl: 'build/pages/welcome/welcome.html',
  directives: [ParticipantWelcomeComponent, GeneralWelcomeComponent]
})
export class WelcomePage implements OnInit {
  public isLogged: Boolean = false;
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;

  constructor(
    private nav: NavController,
    private authService: AuthService,
    private store: Store<AppState>,
    private experimentActions: ExperimentActions,
    private participantActions: ParticipantActions) {

    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authenticateWithToken(token);
    }
  }

  setToast(message) {
    return Toast.create({
      message: message,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
  }

  scanSuccess({ token }) {
    if (token) {
      this.authenticateWithToken(token, () => {
        this.nav.present(this.setToast('Success'));
      });
    } else {
      this.nav.present(this.setToast('QR code is invalid'));
    }
  }

  startExperiment() {
    this.nav.push(HomePage);
  }

  scanError(err) {
    this.nav.present(this.setToast(err));
  }

  authenticateWithToken(token, onSuccess?) {
    this.authService.authenticate(token)
      .subscribe((data: AuthResponse) => {
        this.setParticipant(data.participant);
        this.setExperiment(data.experiment);

        localStorage.setItem('token', token);
        this.isLogged = true;

        if (onSuccess) {
          onSuccess();
        }
      }, (err) => {
        this.nav.present(this.setToast(err))
      });
  }

  setParticipant(participant) {
    this.store.dispatch(this.participantActions.loadParticipant(participant));
  }

  setExperiment(experiment) {
    this.store.dispatch(this.experimentActions.loadExperiment(experiment));
  }

}

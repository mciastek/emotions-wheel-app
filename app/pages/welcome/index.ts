import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { NavController, Toast } from 'ionic-angular';

import { AuthService, AuthResponse } from '../../services/auth.service';
import { ToastService } from '../../services';

import { Participant, Experiment } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';
import { ParticipantActions, ExperimentActions } from '../../actions';

import { ParticipantWelcomeComponent, GeneralWelcomeComponent } from '../../components';

import { HomePage } from '../home/';

@Component({
  templateUrl: 'build/pages/welcome/template.html',
  directives: [ParticipantWelcomeComponent, GeneralWelcomeComponent],
  providers: [ToastService]
})
export class WelcomePage implements OnInit {
  public isLogged: Boolean = false;
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;

  constructor(
    private nav: NavController,
    private translate: TranslateService,
    private authService: AuthService,
    private toastService: ToastService,
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

  scanSuccess({ token }) {
    if (token) {
      this.authenticateWithToken(token, () => {
        this.toastService.show('Success');
      });
    } else {
      this.toastService.show('QR code is invalid');
    }
  }

  startExperiment() {
    this.nav.push(HomePage);
  }

  scanError(err) {
    this.toastService.show(err);
  }

  authenticateWithToken(token, onSuccess?) {
    this.authService.authenticate(token)
      .subscribe((data: AuthResponse) => {
        const { code } = data.participant.language;

        this.setParticipant(data.participant);
        this.setExperiment(data.experiment);

        this.setLanguage(code);

        localStorage.setItem('token', token);
        this.isLogged = true;

        if (onSuccess) {
          onSuccess();
        }
      }, (err) => {
        this.authService.invalidateToken();
        this.toastService.show(err.json().message);
      });
  }

  private setParticipant(participant) {
    this.store.dispatch(this.participantActions.loadParticipant(participant));
  }

  private setExperiment(experiment) {
    this.store.dispatch(this.experimentActions.loadExperiment(experiment));
  }

  private setLanguage(lang) {
    this.translate.use(lang);
  }
}

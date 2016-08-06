import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/filter';

import { NavController, Toast } from 'ionic-angular';

import config from '../../config';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services';

import { Participant, Experiment } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';
import { ParticipantActions, ExperimentActions } from '../../actions';

import { ParticipantWelcomeComponent, GeneralWelcomeComponent } from '../../components';

import { HomePage } from '../home/';
import { FinishedPage } from '../finished';

@Component({
  templateUrl: 'build/pages/welcome/template.html',
  directives: [
    ParticipantWelcomeComponent,
    GeneralWelcomeComponent
  ],
  providers: [
    ToastService,
    TranslatePipe
  ]
})
export class WelcomePage implements OnInit {
  public isLogged: Boolean = false;
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;

  constructor(
    private nav: NavController,
    private translate: TranslateService,
    private translatePipe: TranslatePipe,
    private authService: AuthService,
    private toastService: ToastService,
    private store: Store<AppState>,
    private experimentActions: ExperimentActions,
    private participantActions: ParticipantActions) {

    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());

    this.experiment$
      .filter(e => typeof e.id !==  'undefined')
      .subscribe((e) => this.checkIfExperimentFinished(e));
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authenticateWithToken(token);
    }
  }

  scanSuccess({ token }) {
    const successMsg = this.translatePipe.transform('login.toasts.qrSuccess');
    const invalidMsg = this.translatePipe.transform('login.toasts.qrInvalid');

    if (token) {
      this.authenticateWithToken(token, () => {
        this.toastService.show(successMsg);
      });
    } else {
      this.toastService.show(invalidMsg);
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
      .subscribe((data) => {
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
    const userLang = navigator.language.split('-')[0];
    const langRegex = new RegExp(`(${config.languages.join('|')})`, 'gi');

    const language = langRegex.test(lang) ? lang : 'en';

    this.translate.use(language);
  }

  private checkIfExperimentFinished(experiment: Experiment) {
    const isFinished = experiment.has_completed || !experiment.is_active;

    if (isFinished && localStorage.getItem('token')) {
      this.nav.push(FinishedPage, { experiment });
    }
  }
}

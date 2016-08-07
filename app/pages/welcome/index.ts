import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/filter';

import { NavController, Toast, Alert } from 'ionic-angular';
import { Network } from 'ionic-native';

import config from '../../config';

import { AuthService } from '../../services/auth.service';
import { ToastService, LoaderService } from '../../services';

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
    private loaderService: LoaderService,
    private store: Store<AppState>,
    private experimentActions: ExperimentActions,
    private participantActions: ParticipantActions
  ) {

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

  ionViewWillEnter() {
    this.setLoader();
  }

  scanSuccess({ token }) {
    const errorMessage = this.translatePipe.transform('login.toasts.qrInvalid');

    if (token) {
      this.authenticateWithToken(token, () => {
        const successMessage = this.translatePipe.transform('login.toasts.qrSuccess');

        this.toastService.show(successMessage);
      });
    } else {
      this.toastService.show(errorMessage);
    }
  }

  startExperiment() {
    this.loaderService.show(this.nav);
    this.nav.push(HomePage);
  }

  scanError(err) {
    this.toastService.show(err);
  }

  authenticateWithToken(token, showToast?) {
    this.authService.authenticate(token)
      .subscribe((res) => {
        const { code } = res.participant.language;

        this.setParticipant(res.participant);
        this.setExperiment(res.experiment);

        localStorage.setItem('token', token);

        this.setLanguage(code)
          .subscribe(() => {
            if (showToast) {
              showToast();
            }

            this.isLogged = true;
          });
      }, this.authError.bind(this));
  }

  private authError(res) {
    const error = res.json().error;
    const errorMessage = this.translatePipe.transform('login.toasts.qrInvalid');
    const message = (error.type === 'invalid') ? errorMessage : error;

    this.toastService.show(message);
  }

  private setParticipant(participant) {
    this.store.dispatch(this.participantActions.loadParticipant(participant));
  }

  private setExperiment(experiment) {
    this.store.dispatch(this.experimentActions.loadExperiment(experiment));
  }

  private setLanguage(lang): Observable<any> {
    const userLang = navigator.language.split('-')[0];
    const langRegex = new RegExp(`(${config.languages.join('|')})`, 'gi');

    const language = langRegex.test(lang) ? lang : 'en';

    return this.translate.use(language);
  }

  private checkIfExperimentFinished(experiment: Experiment) {
    const isFinished = experiment.has_completed || !experiment.is_active;

    if (isFinished && localStorage.getItem('token')) {
      this.nav.push(FinishedPage, { experiment });
    }
  }

  private setLoader() {
    const message = this.translatePipe.transform('welcome.loader');

    this.loaderService.create(message);
  }
}

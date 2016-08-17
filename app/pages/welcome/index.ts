import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate/ng2-translate';
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
    ToastService
  ]
})
export class WelcomePage implements OnInit, OnDestroy {
  public isLogged: Boolean = false;
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;
  private disconnectSubscription: Subscription;

  constructor(
    private nav: NavController,
    private translate: TranslateService,
    private authService: AuthService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private store: Store<AppState>,
    private experimentActions: ExperimentActions,
    private participantActions: ParticipantActions
  ) {

    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.authenticateWithToken(token);
    }

    this.disconnectSubscription = Network.onDisconnect()
      .subscribe(this.showDisconnectAlert.bind(this));
  }

  ngOnDestroy() {
    this.disconnectSubscription.unsubscribe();
  }

  scanSuccess({ token }) {
    if (token) {
      this.authenticateWithToken(token, () => {
        const successMessage = this.translate.instant('login.toasts.qrSuccess');
        this.toastService.show(successMessage);
      });
    } else {
      const errorMessage = this.translate.instant('login.toasts.qrInvalid');
      this.toastService.show(errorMessage);
    }
  }

  startExperiment() {
    this.setLoader();
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

        localStorage.setItem('token', token);

        this.setParticipant(res.participant);
        this.setExperiment(res.experiment);

        this.setLanguage(code)
          .subscribe(() => {
            if (this.experimentFinished(res.experiment)) {
              this.nav.push(FinishedPage);

            } else {
              this.isLogged = true;

              if (showToast) {
                showToast();
              }
            }
          });
      }, this.authError.bind(this));
  }

  private authError(res) {
    const error = res.json().error;
    const errorMessage = this.translate.instant('login.toasts.qrInvalid');
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

  private experimentFinished(experiment: Experiment) {
    return experiment.has_completed || !experiment.is_active;
  }

  private setLoader() {
    const message = this.translate.instant('welcome.loader');

    this.loaderService.create(message);
  }

  private showDisconnectAlert() {
    const alert = Alert.create({
      title: this.translate.instant('login.alerts.noConnection.title'),
      subTitle: this.translate.instant('login.alerts.noConnection.message'),
      buttons: [
        this.translate.instant('login.alerts.noConnection.button')
      ]
    });

    this.nav.present(alert);
  }
}

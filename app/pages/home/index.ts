import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscribable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/take';

import { NavController } from 'ionic-angular';

import { DraggableService } from '../../services';

import { Participant, Experiment, Photo } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';
import { RatesActions } from '../../actions';

import {
  EmotionsWheelComponent,
  ExperimentToolbarComponent,
  PhotoSidebarComponent
} from '../../components';

@Component({
  templateUrl: 'build/pages/home/template.html',
  directives: [
    EmotionsWheelComponent,
    ExperimentToolbarComponent,
    PhotoSidebarComponent
  ]
})
export class HomePage implements OnInit {
  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;
  public photos: Photo[];

  constructor(
    private navController: NavController,
    private store: Store<AppState>,
    private draggableService: DraggableService,
    private ratesActions: RatesActions
  ) {
    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());

    this.experiment$.map((e) => e.photos).subscribe((photos) => {
      return this.photos = photos;
    });

    this.connectToExperimentChannel();
  }

  ngOnInit() {
    this.draggableService.init('.js-dropzone', '.js-draggable');

    this.connectToExperimentChannel();
  }

  connectToExperimentChannel() {
    const participantIdObserver: Observable<number> = this.participant$.map(p => p.id);
    const experimentIdObserver: Observable<number> = this.experiment$.map(e => e.id);

    this.store.dispatch(this.ratesActions.connectSocket());

    participantIdObserver.zip(experimentIdObserver).subscribe(([eid, pid]) => {
      this.store.dispatch(this.ratesActions.joinChannel(pid, eid));
    });
  }
}

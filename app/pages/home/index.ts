import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Content } from 'ionic-angular';
import { Observable, Subscribable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';

import { NavController } from 'ionic-angular';

import { DraggableService } from '../../services';

import { Participant, Experiment, Photo } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';
import { RatesActions } from '../../actions';

import { ExperimentToolbarComponent } from '../../components';

import { ExperimentBoard } from '../../containers';

@Component({
  templateUrl: 'build/pages/home/template.html',
  directives: [
    ExperimentToolbarComponent,
    ExperimentBoard
  ]
})
export class HomePage {
  @ViewChild(Content) content: Content;

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
  }
}

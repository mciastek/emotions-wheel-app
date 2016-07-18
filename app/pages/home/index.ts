import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscribable } from 'rxjs/Observable';

import { NavController } from 'ionic-angular';

import { DraggableService } from '../../services';

import { Participant, Experiment, Photo } from '../../models';
import { AppState, getParticipant, getExperiment } from '../../reducers';

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
    private draggableService: DraggableService
  ) {
    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());

    this.experiment$.map((e) => e.photos).subscribe((photos) => {
      return this.photos = photos;
    });
  }

  ngOnInit() {
    this.draggableService.init('.js-dropzone', '.js-draggable');
  }
}

import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Content, Page } from 'ionic-angular';
import { Observable, Subscribable } from 'rxjs/Observable';
import 'rxjs/add/operator/zip';

import { Modal, NavController } from 'ionic-angular';

import { DraggableService, ToastService, LoaderService, SocketService } from '../../services';

import { Participant, Experiment, Photo, Rate } from '../../models';
import { AppState, getParticipant, getExperiment, getRatesEntities } from '../../reducers';
import { ExperimentActions, RatesActions } from '../../actions';

import { ExperimentToolbarComponent, ResearcherContactComponent } from '../../components';

import { ExperimentBoard, BoardOverlay } from '../../containers';

import { GalleryPage } from '../gallery';
import { FinishedPage } from '../finished';

@Component({
  templateUrl: 'build/pages/home/template.html',
  directives: [
    ExperimentToolbarComponent,
    ExperimentBoard,
    BoardOverlay
  ],
  providers: [ToastService]
})
export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(ExperimentBoard) experimentBoard: ExperimentBoard;

  public participant$: Observable<Participant>;
  public experiment$: Observable<Experiment>;
  public rates$: Observable<Rate[]>;
  public photos: Photo[];

  constructor(
    private nav: NavController,
    private store: Store<AppState>,
    private draggableService: DraggableService,
    private loaderService: LoaderService,
    private socketService: SocketService,
    private experimentActions: ExperimentActions,
    private ratesActions: RatesActions
  ) {
    this.participant$ = this.store.let(getParticipant());
    this.experiment$ = this.store.let(getExperiment());
    this.rates$ = this.store.let(getRatesEntities());

    this.experiment$.map((e) => e.photos).subscribe((photos) => {
      return this.photos = photos;
    });
  }

  dismissLoader() {
    this.loaderService.dismiss();
  }

  openContactModal() {
    const modal = Modal.create(ResearcherContactComponent, {
      researcher$: this.experiment$.map(e => e.researcher)
    });

    this.nav.present(modal);
  }

  goToGallery() {
    this.nav.push(GalleryPage);
  }

  goToFinished() {
    this.store.dispatch(this.experimentActions.setAsCompleted());
    this.nav.push(FinishedPage);
  }
}

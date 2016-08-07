import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Modal, Content } from 'ionic-angular';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

import { Experiment, Participant, Photo, Rate } from '../../models';

import { RatesActions, UIActions } from '../../actions';
import { AppState } from '../../reducers';

import { EmotionsWheelComponent, PhotoSidebarComponent } from '../../components';

import { DraggableService, SocketService, ToastService } from '../../services';

@Component({
  selector: 'experiment-board',
  templateUrl: 'build/containers/experiment-board/template.html',
  directives: [
    EmotionsWheelComponent,
    PhotoSidebarComponent
  ],
  providers: [
    ToastService,
    TranslatePipe
  ]
})
export class ExperimentBoard implements OnInit {
  private connectedSocket;
  private dragStartTime: number;

  public imageUrl: string;

  constructor(
    private translatePipe: TranslatePipe,
    private uiActions: UIActions,
    private ratesActions: RatesActions,
    private store: Store<AppState>,
    private socketService: SocketService,
    private draggableService: DraggableService,
    private toastService: ToastService
  ) {}

  @Input() photos: Photo[];
  @Input() rates: Rate[];
  @Input() content: Content;
  @Input() experiment: Experiment;
  @Input() participant: Participant;

  @Output() galleryButtonClick = new EventEmitter();
  @Output() onExperimentConnect = new EventEmitter();

  get galleryEnabled() {
    return this.experiment.kind === 'free_mode';
  }

  get photoCollection() {
    return this.photos.map((photo) => {
      const rate = this.rateByPhoto(photo.id);

      if (rate) {
        return Object.assign(
          this.draggableService.reversedDraggablePosition({
            x: rate.pos_x,
            y: rate.pos_y
          }),
        photo);
      }

      return photo;
    });
  }

  ngOnInit() {
    this.draggableService.init('.emotions-wheel__board', '.photo-item', {
      onDragStart: this.onDragStart.bind(this),
      onDragEnd: this.sendRate.bind(this),
      onDraggableDoubleTap: this.showPhotoModal.bind(this),
      contentView: this.content
    });

    this.connectedSocket = this.connectSocket();
    this.watchSocketResponse();
  }

  ngOnDestroy() {
    this.draggableService.destroy();
  }

  connectSocket() {
    const { id:experimentId } = this.experiment;
    const { id:participantId } = this.participant;

    this.socketService.connect();
    return this.socketService.join(`experiment:${experimentId}`, { participant_id: participantId });
  }

  watchSocketResponse() {
    this.connectedSocket
      .receive('ok', ({ rates }) => {
        this.updateRates(rates);
        this.onExperimentConnect.emit({});
      });
  }

  sendRate(event) {
    const draggable = event.target;
    const photoId = parseInt(draggable.getAttribute('data-photo-id'));
    const position = this.draggableService.draggablePosition(draggable);

    const rate: Rate = {
      name: '',
      pos_x: position.x,
      pos_y: position.y,
      start_time: this.convertDate(this.dragStartTime),
      end_time: this.convertDate(event.timeStamp),
      time: event.timeStamp - this.dragStartTime,
      photo_id: photoId,
      experiment_id: this.experiment.id,
      participant_id: this.participant.id
    };

    this.socketService.channel
      .push('participant:new_rate', rate)
      .receive('ok', this.rateSubmissionResponse.bind(this))
      .receive('error', this.handleError.bind(this));
  }

  onDragStart(event) {
    event.target.classList.add('in-dropzone');
    this.setStartTime(event);
  }

  showPhotoModal(event) {
    const draggable = <HTMLElement>event.currentTarget;
    const photoId = parseInt(draggable.getAttribute('data-photo-id'));
    const photo = this.photoById(photoId);

    this.store.dispatch(this.uiActions.showPhotoPreview(photo.original));
  }

  photoSidebarButtonClick(e) {
    this.galleryButtonClick.emit(e);
  }

  private rateSubmissionResponse({ rates, experiment_completed }) {
    const successMsg = this.translatePipe.transform('experimentBoard.rateSuccess');

    if (!experiment_completed) {
      this.toastService.show(successMsg);
      this.updateRates(rates);
    } else {
      this.store.dispatch(this.uiActions.showBoardOverlay());
    }
  }

  private updateRates(rates) {
    this.store.dispatch(this.ratesActions.loadRates(rates));
  }

  private handleError({ errors }) {
    const errorMessages = this.translatedErrors(errors);

    this.toastService.show(errorMessages.join(', '));
  }

  private setStartTime(event) {
    this.dragStartTime = event.timeStamp;
  }

  private convertDate(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }

  private photoById(photoId) {
    return this.photos.find(p => p.id === photoId);
  }

  private rateByPhoto(photoId) {
    return this.rates.find(r => r.photo_id === photoId);
  }

  private translatedErrors(errors) {
    return errors.map((e) => {
      return this.translatePipe.transform(`experimentBoard.errors.${e.type}`);
    });
  }
}

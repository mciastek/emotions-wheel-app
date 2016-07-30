import { Component, Input, AfterViewInit } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Modal, Content, NavController } from 'ionic-angular';

import { Experiment, Participant, Photo, Rate } from '../../models';

import { RatesActions, UIActions } from '../../actions';
import { AppState } from '../../reducers';

import { EmotionsWheelComponent, PhotoSidebarComponent } from '../../components';
import { PhotoPreview } from '../photo-preview';

import { DraggableService, SocketService, ToastService } from '../../services';

@Component({
  selector: 'experiment-board',
  templateUrl: 'build/containers/experiment-board/template.html',
  directives: [
    EmotionsWheelComponent,
    PhotoSidebarComponent,
    PhotoPreview
  ],
  providers: [ToastService]
})
export class ExperimentBoard implements AfterViewInit {
  private connectedSocket;
  private dragStartTime: number;

  public imageUrl: string;

  constructor(
    private nav: NavController,
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

  ngAfterViewInit() {
    this.draggableService.init('emotions-wheel', '.photo-item', {
      onDragStart: this.onDragStart.bind(this),
      onDragEnd: this.sendRate.bind(this),
      onDraggableDoubleTap: this.showPhotoModal.bind(this),
      contentView: this.content
    });

    this.connectedSocket = this.connectSocket();
    this.watchSocketResponse();
  }

  connectSocket() {
    const { id:experimentId } = this.experiment;
    const { id:participantId } = this.participant;

    this.socketService.connect();
    return this.socketService.join(`experiments:${experimentId}`, { participant_id: participantId });
  }

  watchSocketResponse() {
    this.connectedSocket
      .receive('ok', ({ rates }) => this.updateRates(rates));
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
      .receive('ok', ({ rates }) => {
        this.toastService.show('Rate saved!');
        this.updateRates(rates);
      })
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

  private updateRates(rates) {
    this.store.dispatch(this.ratesActions.loadRates(rates));
  }

  private handleError({ errors }) {
    this.toastService.show(errors.join(', '));
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
}

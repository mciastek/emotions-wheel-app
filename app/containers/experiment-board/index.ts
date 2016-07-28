import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Content } from 'ionic-angular';

import { Experiment, Participant, Photo, Rate } from '../../models';

import { RatesActions } from '../../actions';
import { AppState, getRatesEntities } from '../../reducers';

import { EmotionsWheelComponent, PhotoSidebarComponent } from '../../components';

import { DraggableService, SocketService, ToastService } from '../../services';

@Component({
  selector: 'experiment-board',
  templateUrl: 'build/containers/experiment-board/template.html',
  directives: [
    EmotionsWheelComponent,
    PhotoSidebarComponent
  ],
  providers: [ToastService]
})
export class ExperimentBoard implements OnInit {
  private connectedSocket;
  private dragStartTime: number;

  public rates$: Observable<Rate[]>;

  constructor(
    private ratesActions: RatesActions,
    private store: Store<AppState>,
    private socketService: SocketService,
    private draggableService: DraggableService,
    private toastService: ToastService
  ) {
    this.rates$ = this.store.let(getRatesEntities());
  }

  @Input() photos: Photo[];
  @Input() content: Content;
  @Input() experiment: Experiment;
  @Input() participant: Participant;

  ngOnInit() {
    this.draggableService.init('emotions-wheel', '.js-draggable', {
      onDragStart: this.setStartTime.bind(this),
      onDragEnd: this.sendRate.bind(this)
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
      .receive('ok', this.updateRates.bind(this));
  }

  sendRate(event) {
    const draggable = event.target;
    const photoId = parseInt(draggable.getAttribute('data-photo-id'));
    const position = this.computePositions(draggable, event.dropzone);

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

  private updateRates({ rates }) {
    this.store.dispatch(this.ratesActions.loadRates(rates));
  }

  private handleError({ errors }) {
    this.toastService.show(errors.join(', '));
  }

  private setStartTime(event) {
    this.dragStartTime = event.timeStamp;
  }

  private computePositions(draggable, dropzone) {
    const contentDimensions = this.content.getContentDimensions();

    const dropzoneDimensions = {
      top: dropzone.getRect().top + contentDimensions.scrollTop,
      left: dropzone.getRect().left + contentDimensions.scrollLeft,
      width: dropzone.getRect().width,
      height: dropzone.getRect().height,
    };

    const draggablePosition = {
      top: draggable.getBoundingClientRect().top + contentDimensions.scrollTop,
      left: draggable.getBoundingClientRect().left + contentDimensions.scrollLeft,
    };

    return {
      x: Math.abs(dropzoneDimensions.left - draggablePosition.left) / dropzoneDimensions.width,
      y: Math.abs(dropzoneDimensions.top - draggablePosition.top) / dropzoneDimensions.height,
    };
  }

  private convertDate(timestamp: number): string {
    return new Date(timestamp).toISOString();
  }
}

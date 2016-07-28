import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Content } from 'ionic-angular';

import { Experiment, Participant, Photo, Rate } from '../../models';

import { RatesActions } from '../../actions';
import { AppState, getRatesEntities } from '../../reducers';

import { EmotionsWheelComponent, PhotoSidebarComponent } from '../../components';

import { DraggableService, SocketService } from '../../services';

@Component({
  selector: 'experiment-board',
  templateUrl: 'build/containers/experiment-board/template.html',
  directives: [
    EmotionsWheelComponent,
    PhotoSidebarComponent
  ]
})
export class ExperimentBoard implements OnInit {
  private connectedSocket;
  private wheelElement: HTMLElement;
  private dragStartTime: number;

  public rates$: Observable<Rate[]>;

  constructor(
    private ratesActions: RatesActions,
    private store: Store<AppState>,
    private socketService: SocketService,
    private draggableService: DraggableService
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

    this.wheelElement = <HTMLElement>document.querySelector('emotions-wheel');

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
      .receive('ok', ({ rates }) => {
        this.store.dispatch(this.ratesActions.loadRates(rates));
      });
  }

  getWheelPosition() {
    return { top: this.wheelElement.offsetTop, left: this.wheelElement.offsetLeft };
  }

  sendRate(event) {
    const element = event.target;
    const photoId = parseInt(element.getAttribute('data-photo-id'));
    const position = this.computePositions(event.interactable, event.dropzone);

    const rate: Rate = {
      name: '',
      pos_x: position.x,
      pos_y: position.y,
      start_time: this.dragStartTime,
      end_time: event.timeStamp,
      time: event.timeStamp - this.dragStartTime,
      photo_id: photoId,
      experiment_id: this.experiment.id,
      participant_id: this.participant.id
    };
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
      top: draggable.getRect().top + contentDimensions.scrollTop,
      left: draggable.getRect().left + contentDimensions.scrollLeft,
    };

    return {
      x: Math.abs(dropzoneDimensions.left - draggablePosition.left) / dropzoneDimensions.width,
      y: Math.abs(dropzoneDimensions.top - draggablePosition.top) / dropzoneDimensions.height,
    };
  }
}

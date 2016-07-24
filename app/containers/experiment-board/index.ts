import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

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
  @Input() experiment: Experiment;
  @Input() participant: Participant;

  ngOnInit() {
    this.draggableService.init('emotions-wheel', '.js-draggable', {
      onDragEnd: this.sendRate
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
      .receive('ok', ({ rates }) => {
        this.store.dispatch(this.ratesActions.loadRates(rates));
      });
  }

  sendRate(event) {
    console.log(event)
  }
}

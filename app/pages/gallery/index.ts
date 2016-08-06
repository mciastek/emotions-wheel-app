import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { Observable, Subscribable } from 'rxjs/Observable';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import * as moment from 'moment';

import { Camera } from 'ionic-native';

import { ToastService, PhotoUploadService, PhotosService } from '../../services';

import { Participant, Photo } from '../../models';
import { AppState, getParticipant } from '../../reducers';
import { ParticipantActions } from '../../actions';

import { PhotoGallery } from '../../containers';

@Component({
  templateUrl: 'build/pages/gallery/template.html',
  directives: [PhotoGallery],
  providers: [
    ToastService,
    PhotoUploadService,
    TranslatePipe
  ]
})
export class GalleryPage implements AfterViewInit {
  static CAMERA_OPTIONS = {
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
    quality: 70,
    targetWidth: 1000,
    targetHeight: 1000
  };

  public participant$: Observable<Participant>;
  public photos: Photo[];
  private participantId: number;

  constructor(
    private nav: NavController,
    private store: Store<AppState>,
    private translatePipe: TranslatePipe,
    private toastService: ToastService,
    private photoUploadService: PhotoUploadService,
    private photosService: PhotosService,
    private participantActions: ParticipantActions
  ) {
    this.participant$ = this.store.let(getParticipant());

    this.participant$.subscribe((participant) => {
      this.participantId = participant.id;
      this.photos = participant.photos;
    });
  }

  ngAfterViewInit() {
    this.photosService.fetchAll(this.participantId)
      .subscribe(({ photos }) => {
        this.loadPhotos(photos);
      });
  }

  takePhoto() {
    Camera.getPicture(GalleryPage.CAMERA_OPTIONS)
      .then((imageData) => {
        this.savePhoto(imageData)
          .subscribe(
            this.uploadSuccess.bind(this),
            this.cameraError.bind(this)
          );
      })
      .catch(this.cameraError.bind(this));
  }

  goBack() {
    this.nav.pop();
  }

  private savePhoto(imageData) {
    const now = moment();
    const fileName = this.generateFileName();

    return this.photoUploadService.save(`participants/${this.participantId}/photos`, imageData, fileName, {
      name: `${now.format('YYYY-MM-DD')} ${now.format('H:m:s')}, by participant: "${this.participantId}"`,
      author_type: 'participant',
      author_id: this.participantId
    });
  }

  private uploadSuccess({ photos }) {
    const message = this.translatePipe.transform('gallery.uploadSuccess');
    this.toastService.show(message);
    this.loadPhotos(photos);
  }

  private cameraError(err) {
    this.toastService.show(err);
  }

  private generateFileName(ext = 'jpg'): string {
    const now = moment();

    return `${now.format('YYYYMMDD')}_${now.format('Hms')}-participant_${this.participantId}_photo.${ext}`;
  }

  private loadPhotos(photos) {
    this.store.dispatch(this.participantActions.loadPhotos(photos));
  }
}


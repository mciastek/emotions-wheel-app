import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class UIActions {
  static SHOW_PHOTO_PREVIEW = '[UI] Show photo preview';
  showPhotoPreview(imageUrl): Action {
    return {
      type: UIActions.SHOW_PHOTO_PREVIEW,
      payload: {
        imageUrl,
        isOpened: true
      }
    }
  }

  static HIDE_PHOTO_PREVIEW = '[UI] Hide photo preview';
  hidePhotoPreview(): Action {
    return {
      type: UIActions.HIDE_PHOTO_PREVIEW,
      payload: {
        isOpened: false
      }
    }
  }

  static SHOW_BOARD_OVERLAY = '[UI] Show board overlay';
  showBoardOverlay(): Action {
    return {
      type: UIActions.SHOW_BOARD_OVERLAY,
      payload: {
        isVisible: true
      }
    }
  }
}

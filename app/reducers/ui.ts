import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

import { UI } from '../models';
import { UIActions } from '../actions';

export interface UIState {
  photoPreview: {
    imageUrl: string;
    isOpened: boolean;
  }
}

const initialState: UIState = <UI>{
  photoPreview: {
    imageUrl: '',
    isOpened: false
  },
  boardOverlay: {
    isVisible: false
  }
};

export default function(state = initialState, action: Action): UIState {
  switch (action.type) {
    case UIActions.SHOW_PHOTO_PREVIEW: {
      const { imageUrl, isOpened } = action.payload;

      return Object.assign({}, state, {
        photoPreview: { imageUrl, isOpened }
      });
    }

    case UIActions.HIDE_PHOTO_PREVIEW: {
      const { isOpened } = action.payload;

      return Object.assign({}, state, {
        photoPreview: {
          imageUrl: '',
          isOpened: isOpened
        }
      });
    }

    case UIActions.SHOW_BOARD_OVERLAY: {
      const { isVisible } = action.payload;

      return Object.assign({}, state, {
        boardOverlay: { isVisible }
      });
    }

    default: {
      return state;
    }
  }
}

export function getPhotoPreview() {
  return (state$: Observable<UIState>) => state$.select(s => s.photoPreview);
}

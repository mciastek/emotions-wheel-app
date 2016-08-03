export interface PhotoPreviewState {
  imageUrl: string;
  isOpened: boolean;
}

export interface BoardOverlay {
  isVisible: boolean;
}

export interface UI {
  photoPreview: PhotoPreviewState;
  boardOverlay: BoardOverlay;
}

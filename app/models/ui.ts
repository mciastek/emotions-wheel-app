export interface PhotoPreviewState {
  imageUrl: string;
  isOpened: boolean;
}

export interface BoardOverlayState {
  isVisible: boolean;
}

export interface UI {
  photoPreview: PhotoPreviewState;
  boardOverlay: BoardOverlayState;
}

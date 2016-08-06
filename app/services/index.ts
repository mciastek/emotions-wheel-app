import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { DraggableService } from './draggable.service';
import { ToastService } from './toast.service';
import { PhotoUploadService } from './photo-upload.service';
import { PhotosService } from './photos.service';
import { LoaderService } from './loader.service';

export {
  AuthService,
  SocketService,
  DraggableService,
  ToastService,
  PhotoUploadService,
  PhotosService,
  LoaderService
};

export default [
  AuthService,
  SocketService,
  DraggableService,
  ToastService,
  PhotoUploadService,
  PhotosService,
  LoaderService
];

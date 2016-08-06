import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { DraggableService } from './draggable.service';
import { ToastService } from './toast.service';
import { PhotoUploadService } from './photo-upload.service';

export {
  AuthService,
  SocketService,
  DraggableService,
  ToastService,
  PhotoUploadService
};

export default [
  AuthService,
  SocketService,
  DraggableService,
  ToastService,
  PhotoUploadService
];

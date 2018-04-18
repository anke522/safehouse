import { SensorStatus, SensorType, Position } from '../models';

const doorCamera = {
  id: 'door-camera',
  type: SensorType.Camera,
  status: SensorStatus.Normal,
  message: '',
  position: {
    lat: 0,
    lon: 0,
    alt: 0
  },
  related: ['access-point']
};

export interface DoorCameraOptions {
  id?: string;
  type?: SensorType;
  status?: SensorStatus;
  position?: Position;
  message?: string;
  related?: string[];
}

export const getDoorCamera = ({id, type, status, message, position, related}: DoorCameraOptions = {}) => ({
  id: id || doorCamera.id,
  type: type || doorCamera.type,
  status: status || doorCamera.status,
  message: message || doorCamera.message,
  related: related || doorCamera.related.slice(0),
  position: position || {
    lat: doorCamera.position.lat,
    lon: doorCamera.position.lon,
    alt: doorCamera.position.alt
  },
});

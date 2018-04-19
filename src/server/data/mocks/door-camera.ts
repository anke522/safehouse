import { SensorStatus, SensorType, Position, Sensor } from '../models';


const doorCamera: Sensor = {
  id: 'door-camera',
  type: SensorType.Camera,
  name: 'Door Camera',
  status: SensorStatus.Normal,
  message: '',
  position: {
    lon: -82.4374762,
    lat: 27.9561611 + 0.0000150,
    alt: 2.6,
  },
  related: ['access-point']
};

export interface DoorCameraOptions {
  id?: string;
  type?: SensorType;
  name?: string;
  status?: SensorStatus;
  position?: Position;
  message?: string;
  related?: string[];
}

export const getDoorCamera = ({id, type, name, status, message, position, related}: DoorCameraOptions = {}): Sensor => ({
  id: id || doorCamera.id,
  type: type || doorCamera.type,
  name: name || doorCamera.name,
  status: status || doorCamera.status,
  message: message || doorCamera.message,
  related: related || doorCamera.related.slice(0),
  position: position || {
    lat: doorCamera.position.lat,
    lon: doorCamera.position.lon,
    alt: doorCamera.position.alt
  },
});

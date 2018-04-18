import { SensorStatus, SensorType, Position } from '../models';

const accessPoint = {
  id: 'access-point',
  type: SensorType.AccessPoint,
  status: SensorStatus.Normal,
  message: '',
  position: {
    lat: 0,
    lon: 0,
    alt: 0
  },
  related: ['door-camera']
};

export interface AccessPointOptions {
  id?: string;
  type?: SensorType;
  status?: SensorStatus;
  position?: Position;
  message?: string;
  related?: string[];
}

export const getAccessPoint = ({id, type, status, message, position, related}: AccessPointOptions = {}) => ({
  id: id || accessPoint.id,
  type: type || accessPoint.type,
  status: status || accessPoint.status,
  message: message || accessPoint.message,
  related: related || accessPoint.related.slice(0),
  position: position || {
    lat: accessPoint.position.lat,
    lon: accessPoint.position.lon,
    alt: accessPoint.position.alt
  },
});

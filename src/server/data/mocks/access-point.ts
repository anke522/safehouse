import { SensorStatus, SensorType, Position, Sensor } from '../models';

const accessPoint: Sensor = {
  id: 'access-point',
  type: SensorType.AccessPoint,
  name: 'Access Point',
  status: SensorStatus.Normal,
  message: '',
  position: {
    lon: -82.4374762 +  0.0000279,
    lat: 27.9561611 + 0.0000269,
    alt: 2.0
  },
  related: ['door-camera']
};

export interface AccessPoint {
  id?: string;
  type?: SensorType;
  name?: string;
  status?: SensorStatus;
  position?: Position;
  message?: string;
  related?: string[];
}

export const getAccessPoint = ({id, type, name, status, message, position, related}: AccessPoint = {}): Sensor => ({
  id: id || accessPoint.id,
  type: type || accessPoint.type,
  name: name || accessPoint.name,
  status: status || accessPoint.status,
  message: message || accessPoint.message,
  related: related || accessPoint.related.slice(0),
  position: position || {
    lat: accessPoint.position.lat,
    lon: accessPoint.position.lon,
    alt: accessPoint.position.alt
  },
});

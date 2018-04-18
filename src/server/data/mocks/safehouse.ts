import { getAccessPoint, getDoorCamera } from './';
import { BuildingStatus, Sensor, Position } from '../models';

const safehosue = {
  id: 'safe-house',
  name: 'Safehouse',
  status: BuildingStatus.Normal,
  position: {
    lon: -82.4374762,
    lat: 27.9561611,
    alt: 0.0
  },
  sensors: [getAccessPoint(), getDoorCamera()]
};

export interface SafehouseOptions {
  id?: string;
  name?: string;
  status?: BuildingStatus;
  position?: Position;
  sensors?: Sensor[];
}

export const getSafeHouse = ({id, name, status, position, sensors}: SafehouseOptions = {}) => ({
  id: id || safehosue.id,
  name: name || safehosue.name,
  status: status || safehosue.status,
  sensors: sensors || safehosue.sensors.slice(0),
  position: position || {
    lat: safehosue.position.lat,
    lon: safehosue.position.lon,
    alt: safehosue.position.alt
  }
});

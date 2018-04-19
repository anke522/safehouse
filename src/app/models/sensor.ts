import { Position } from './position';

export enum SensorType {
  Camera = 'CAMERA',
  AccessPoint = 'ACCESS_POINT'
}

export enum SensorStatus {
  Normal = 'Normal',
  Engaged = 'Engaged',
  Warning = 'Warning',
  Compromised = 'Compromised'
}

export interface Sensor {
  id: string;
  type: SensorType;
  status: SensorStatus;
  position: Position;
  message: string;
  name: string;
  related: string[];
}

import { Position } from './position';

export enum SensorType {
  Camera = 'CAMERA',
  AccessPoint = 'ACCESS_POINT'
}

export enum SensorStatus {
  Normal = 'NORMAL',
  Warning = 'WARNING',
  Critical = 'CRITICAL'
}

export interface Sensor {
  id: string;
  type: SensorType;
  status: SensorStatus;
  position: Position;
  message: string;
  related: string[];
}

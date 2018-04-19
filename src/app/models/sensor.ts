import { Position } from './position';

export enum SensorType {
  Camera = 'CAMERA',
  AccessPoint = 'ACCESS_POINT'
}

export enum SensorStatus {
  Normal = 'NORMAL',
  Warning = 'WARNING',
  Critical = 'CRITICAL',
  Compromised = 'COMPROMISED',
}

export interface Sensor {
  id: string;
  type: SensorType;
  status: SensorStatus;
  position: Position;
  message: string;
  name: string;
  related: RelatedSensor[];
}

export interface RelatedSensor {
  id: string;
  status: SensorStatus;
  position: Position;
}

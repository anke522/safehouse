import { Position } from './position';

export enum SensorType {
  Camera = 'CAMERA',
  AccessPoint = 'ACCESS_POINT',
  DoorLock = 'DOOR_LOCK',
  Alexa = 'ALEXA',
  Lamp = 'LAMP',
}

export enum SensorStatus {
  Normal = 'NORMAL',
  Engaged = 'ENGAGED',
  Warning = 'WARNING',
  Critical = 'CRITICAL'
}

export interface Sensor {
  id: string;
  type: SensorType;
  name: string;
  status: SensorStatus;
  position: Position;
  message: string;
  related: string[];
}

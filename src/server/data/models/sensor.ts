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
  Compromised = 'COMPROMISED'
}

export interface Sensor {
  id: string;
  type: SensorType;
  name: string;
  status: SensorStatus;
  combinedStatus: SensorStatus;
  position: Position;
  message: string;
  related: string[];
}

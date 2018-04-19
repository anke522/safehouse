import { Position } from './position';

export enum SensorType {
  Camera = 'CAMERA',
  MotionDetector = 'MOTION_DETECTOR',
  AccessPoint = 'ACCESS_POINT',
  DoorLock = 'DOOR_LOCK',
  Alexa = 'ALEXA',
  Lamp = 'LAMP',
}

export enum SensorStatus {
  Normal = 0,
  Engaged = 1,
  Warning = 2,
  Compromised = 3
}

export interface Sensor {
  id: string;
  type: SensorType;
  name: string;
  status: SensorStatus;
  combinedStatus?: SensorStatus;
  position: Position;
  message: string;
  related: string[];
}

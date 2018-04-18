import { Sensor } from './sensor';
import { Position } from './position';

export enum BuildingStatus {
  Normal = 'NORMAL',
  Warning = 'WARNING',
  Critical = 'CRITICAL'
}

export interface Building {
  id: string;
  name: string;
  status: BuildingStatus;
  position: Position;
  sensors: Sensor[];
}

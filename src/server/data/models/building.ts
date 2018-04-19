import { Sensor } from './sensor';
import { Position } from './position';

export enum BuildingStatus {
  Normal = 'NORMAL',
  Compromised = 'COMPROMISED'
}

export interface Building {
  id: string;
  name: string;
  status: BuildingStatus;
  position: Position;
  sensors: Sensor[];
}

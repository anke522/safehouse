import { Sensor } from './sensor';
import { Position } from './position';

export enum BuildingStatus {
  Normal = 0,
  Compromised = 1
}

export interface Building {
  id: string;
  name: string;
  status: BuildingStatus;
  position: Position;
  sensors: Sensor[];
}

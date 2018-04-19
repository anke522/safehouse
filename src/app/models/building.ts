import { Sensor } from './sensor';
import { Position } from './position';

export enum BuildingStatus {
  Normal = 'Normal',
  Compromised = 'Compromised'
}

export interface Building {
  id: string;
  name: string;
  status: BuildingStatus;
  position: Position;
  sensors: Sensor[];
}

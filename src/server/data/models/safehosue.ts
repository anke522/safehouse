import { Sensor } from './sensor';
import { Position } from './position';

export enum SafehouseStatus {
  Normal = 'NORMAL',
  Warning = 'WARNING',
  Critical = 'CRITICAL'
}

export interface Safehouse {
  id: string;
  name: string;
  status: SafehouseStatus;
  position: Position;
  sensors: Sensor[];
}

import { Position } from './position';

export interface Sensor {
  id: string;
  name: string;
  color: string;
  position: Position;
}

export const createSensor = (id: string, name: string, color: string, position: Position): Sensor => ({
  id,
  name,
  color,
  position
});

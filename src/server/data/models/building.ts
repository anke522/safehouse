import { Position } from './position';

export interface Building {
  id: string;
  name: string;
  color: string;
  position: Position;
}

export const createBuilding = (id: string, name: string, color: string, position: Position): Building => ({
  id,
  name,
  color,
  position
});

import { Safehouse, SafehouseStatus, Sensor, Position } from '../models';

export class SafehouseStore {

  private _id: string;
  private _name: string;
  private _status: SafehouseStatus;
  private _position: Position;
  private _sensors: Sensor[];

  constructor(building: Safehouse) {
    this._id = building.id;
    this._name = building.name;
    this._status = building.status;
    this._position = building.position;
    this._sensors = building.sensors || [];
  }

  getState(): Safehouse {
    return {
      id: this._id,
      name: this._name,
      status: this._status,
      position: this._position,
      sensors: this._sensors.slice(0)
    }
  }

  getSensorById(id: string): Sensor {
    return this._sensors.find(sensor => sensor.id === id);
  }

  addOrUpdateSensor(sensor: Sensor) {
    const result = this._sensors.find(x => x.id === sensor.id);

    if (result) {
      Object.assign(result, sensor);
    }
    else {
      this._sensors.push(sensor);
    }
  }
}

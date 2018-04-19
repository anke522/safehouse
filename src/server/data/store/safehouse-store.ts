import { Building, BuildingStatus, Position, Sensor, SensorStatus } from '../models';

export class SafehouseStore {

  private _id: string;
  private _name: string;
  private _status: BuildingStatus;
  private _position: Position;
  private _sensors: Sensor[];

  constructor(building: Building) {
    this._id = building.id;
    this._name = building.name;
    this._status = building.status;
    this._position = building.position;
    this._sensors = building.sensors || [];
  }

  getState(): Building {
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

    const originalNewStauts = sensor.status;
    delete sensor.status;
    if (result) {
      Object.assign(result, sensor);
    }
    else {
      this._sensors.push(sensor);
    }

    this.updateSensorStatus(sensor, originalNewStauts);

    this._sensors.forEach(s => {
        if (this.isSensorsRelated(s, sensor)) {
          if(s.status >= SensorStatus.Warning && sensor.status >= SensorStatus.Warning) {
            s.combinedStatus = SensorStatus.Compromised;
            sensor.combinedStatus = SensorStatus.Compromised;
          } else if (s.status >= SensorStatus.Warning || sensor.status >= SensorStatus.Warning){
            s.combinedStatus = Math.max(s.status, sensor.status);
            sensor.combinedStatus = Math.max(s.status, sensor.status);
          }
        }
      }
    );
  }

  updateSafehouseStatus(status: BuildingStatus) {
    if (this._status < status) {
      this._status = status;
    }
  }

  private isSensorsRelated(sensor1: Sensor, sensor2: Sensor): boolean {
    return sensor1.related.findIndex(s => s === sensor2.id) >= 0;
  }

  private updateSensorStatus(sensor: Sensor, status: SensorStatus): SensorStatus | undefined {
    if (sensor.status <= 1 || sensor.status < status) {
      sensor.status = status;
      return status;
    }

    return undefined;
  }
}

import { Building, BuildingStatus, Position, Sensor, SensorStatus, SensorType } from '../models';

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

  addOrUpdateSensor(sensorUpdate: Sensor) {
    const sensor = this._sensors.find(x => x.id === sensor.id) || sensorUpdate;
    const originalNewStatus = sensorUpdate.status;
    const originalNewMessage = sensorUpdate.message;

    if (sensor !== sensorUpdate) {
      delete sensorUpdate.message;
      delete sensorUpdate.status;
      Object.assign(sensor, sensorUpdate);
    }
    else {
      this._sensors.push(sensor);
    }

    this.updateSensorStatus(sensor, originalNewStatus, originalNewMessage);

    this._sensors.forEach(s => {
        if (this.isSensorsRelated(s, sensor)) {
          if (s.status >= SensorStatus.Warning && sensor.status >= SensorStatus.Warning) {
            s.combinedStatus = SensorStatus.Compromised;
            sensor.combinedStatus = SensorStatus.Compromised;
          }
          // else if (s.status >= SensorStatus.Warning || sensorUpdate.status >= SensorStatus.Warning) {
          //   s.combinedStatus = Math.max(s.status, sensorUpdate.status);
          //   sensorUpdate.combinedStatus = Math.max(s.status, sensorUpdate.status);
          // }
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

  private updateSensorStatus(sensor: Sensor, status: SensorStatus, message: string) {
    if (sensor.status <= 1 || sensor.status <= status) {
      sensor.status = status;
      sensor.message = message;
    }
  }
}

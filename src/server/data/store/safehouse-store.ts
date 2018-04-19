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

  addOrUpdateSensor(sensor: Sensor) {
    const resultSensor = this._sensors.find(x => x.id === sensor.id) || sensor;
    const originalNewStatus = sensor.status;
    const originalNewMessage = sensor.message;

    if (resultSensor) {
      delete sensor.status;
      delete sensor.message;
      Object.assign(resultSensor, sensor);
    }
    else {
      this._sensors.push(sensor);
    }

    this.updateSensorStatus(resultSensor, originalNewStatus, originalNewMessage);

    this._sensors.forEach(s => {
        if (this.isSensorsRelated(s, resultSensor)) {
          if (s.status >= SensorStatus.Warning && resultSensor.status >= SensorStatus.Warning) {
            s.combinedStatus = SensorStatus.Compromised;
            resultSensor.combinedStatus = SensorStatus.Compromised;
          }
          // else if (s.status >= SensorStatus.Warning || resultSensor.status >= SensorStatus.Warning) {
          //   s.combinedStatus = Math.max(s.status, resultSensor.status);
          //   resultSensor.combinedStatus = Math.max(s.status, resultSensor.status);
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

  private updateSensorStatus(sensor: Sensor, status: SensorStatus, message: string): SensorStatus | undefined {
    if (sensor.status <= 1 || sensor.status < status) {
      sensor.status = status;
      sensor.message = message;
      return status;
    }

    return undefined;
  }
}

import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { SafehouseStore } from '../../services/safehouse-store.service';
import { Sensor, SensorStatus } from '../../models/sensor';

const SENSOR_COLORS_BY_STATUS = {
  Engaged: Cesium.Color.GREEN.withAlpha(0.9),
  Warning: Cesium.Color.YELLOW.withAlpha(0.9),
  Compromised: Cesium.Color.RED.withAlpha(0.9),
  Normal: Cesium.Color.GRAY.withAlpha(0.9),
};

@Component({
  selector: 'sensors-layer',
  templateUrl: './sensors-layer.component.html',
  styleUrls: ['./sensors-layer.component.css']
})
export class SensorsLayerComponent implements OnInit {
  Cesium = Cesium;
  boxDimensions = new Cesium.Cartesian3(0.25, 0.25, 0.25);
  labelOffset = new Cesium.Cartesian2(0.0, -70);
  labelFadeByDistance = new Cesium.NearFarScalar(50, 1.0, 200, 0.0);
  sensors$: Observable<AcNotification>;
  sensorConnectionsMap = new Map();

  createDashedColor(cesiumColor) {
    return new Cesium.PolylineDashMaterialProperty({
      color: cesiumColor
    });
  }

  connectionIdGetter(entity: any): string {
    return entity.id;
  }

  createConnection(sensor, relatedSensor, dashedColor) {
    return {
      id: `${sensor.id}:${relatedSensor.id}`,
      positions: [Cesium.Cartesian3.fromDegrees(sensor.position.lon, sensor.position.lat, sensor.position.alt),
        Cesium.Cartesian3.fromDegrees(relatedSensor.position.lon, relatedSensor.position.lat, relatedSensor.position.alt),
      ],
      material: this.createDashedColor(dashedColor),
    }
  }

  checkConnections(sensors: Sensor[]) {
    const isBadStatus = (s) => s.status === SensorStatus.Compromised || s.status === SensorStatus.Warning;

    sensors.forEach(sensor => {
      if (isBadStatus(sensor)) {
        const relatedWithBadStatus = sensor.related.filter(relatedSensor => isBadStatus(relatedSensor));
        if (relatedWithBadStatus && relatedWithBadStatus.length) {
          // Check if doesnt already exits
          const relatedToPaint = relatedWithBadStatus.filter(relatedBadSensor => !this.sensorConnectionsMap.has(relatedBadSensor.id));

          if (relatedToPaint && relatedToPaint.length) {
            const connectionsLines = relatedToPaint.map(relatedSensor => this.createConnection(
              sensor,
              relatedSensor,
              sensor.status === SensorStatus.Compromised || relatedSensor.status === SensorStatus.Compromised ?
                Cesium.Color.RED :
                Cesium.Color.YELLOW));
            this.sensorConnectionsMap.set(sensor.id, connectionsLines);
          }
        } else {
          const connectionsLines = sensor.related.map(relatedSensor => this.createConnection(
            sensor,
            relatedSensor,
            Cesium.Color.CYAN));
          this.sensorConnectionsMap.set(sensor.id, connectionsLines);
        }
      } else {
        this.sensorConnectionsMap.delete(sensor.id);
      }
    });
  }

  constructor(safehouseStore: SafehouseStore) {
    this.sensors$ = safehouseStore.listenToSensors(1000)
      .do(sensors => this.checkConnections(sensors))
      .flatMap(sensor => sensor)
      .map(sensor => ({
          id: sensor.id,
          actionType: ActionType.ADD_UPDATE,
          entity: Object.assign({}, sensor, {
            position: Cesium.Cartesian3.fromDegrees(sensor.position.lon, sensor.position.lat, sensor.position.alt),
            color: SENSOR_COLORS_BY_STATUS[sensor.status] || SENSOR_COLORS_BY_STATUS.Normal,
            name: `${sensor.name}, status: ${sensor.status}`,
            showMessage: sensor.message && sensor.message.length !== 0,
            message: sensor.message,
            connections: this.sensorConnectionsMap.get(sensor.id),
          })
        })
      )
  }

  ngOnInit() {
  }

}

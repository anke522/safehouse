import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from "angular-cesium";
import { Observable } from "rxjs/Observable";
import { SafehouseStore } from "../../services/safehouse-store.service";

const SENSOR_COLORS_BY_STATUS = {
  ENGAGED: Cesium.Color.GREEN.withAlpha(0.9),
  WARNING: Cesium.Color.YELLOW.withAlpha(0.9),
  COMPROMISED: Cesium.Color.RED.withAlpha(0.9),
  NORMAL: Cesium.Color.WHITE,
};

@Component({
  selector: 'sensors-layer',
  templateUrl: './sensors-layer.component.html',
  styleUrls: ['./sensors-layer.component.css']
})
export class SensorsLayerComponent implements OnInit {
  Cesium = Cesium;
  boxDimensions = new Cesium.Cartesian3(0.25, 0.25, 0.25);
  sensors$: Observable<AcNotification>;

  constructor(safehouseStore: SafehouseStore) {
    this.sensors$ = safehouseStore.listenToSensors(1000)
      .map(sensor => ({
        id: sensor.id,
        actionType: ActionType.ADD_UPDATE,
        entity: Object.assign({}, sensor, {
          position: Cesium.Cartesian3.fromDegrees(sensor.position.lon, sensor.position.lat, sensor.position.alt),
          color: SENSOR_COLORS_BY_STATUS[sensor.status] || SENSOR_COLORS_BY_STATUS.NORMAL,
          name: `${sensor.type}, status: ${sensor.status}`,
          showMessage: sensor.message && sensor.message.length !== 0,
          message: sensor.message,
        })
      }));
  }

  ngOnInit() {
  }

}

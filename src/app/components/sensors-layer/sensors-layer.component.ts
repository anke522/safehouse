import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from "angular-cesium";
import { Observable } from "rxjs/Observable";
import { SafehouseStore } from "../../services/safehouse-store.service";

console.log(Cesium);

const SENSOR_COLORS_BY_STATUS = {
  NORMAL: Cesium.Color.GREEN.withAlpha(0.5),
  WARNING: Cesium.Color.YELLOW.withAlpha(0.5),
  CRITICAL: Cesium.Color.RED.withAlpha(0.5)
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
    this.sensors$ = safehouseStore.listenToSensors().map(sensor => ({
      id: sensor.id,
      actionType: ActionType.ADD_UPDATE,
      entity: Object.assign({}, sensor, {
        position: Cesium.Cartesian3.fromDegrees(sensor.position.lon, sensor.position.lat, sensor.position.alt),
        color: SENSOR_COLORS_BY_STATUS[sensor.status] || SENSOR_COLORS_BY_STATUS.NORMAL,
      })
    }));
  }

  ngOnInit() {
  }

}

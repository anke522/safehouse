import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcLayerComponent, AcNotification, ActionType, CesiumService } from 'angular-cesium';
import { SafehouseStore } from '../../services/safehouse-store.service';
import { BuildingStatus } from '../../models/building';
import { AlertService } from './alert.service';

const BUILDING_COLORS = {
  NORMAL: Cesium.Color.WHITE.withAlpha(0.5),
  COMPROMISED: Cesium.Color.RED.withAlpha(0.5),
}

@Component({
  selector: 'safehouse-layer',
  templateUrl: './safehouse-layer.component.html',
  styleUrls: ['./safehouse-layer.component.css'],
  providers: [AlertService],
})
export class SafehouseLayer {
  Cesium = Cesium;
  buildings$: Observable<AcNotification>;
  didFlyTo = false;
  buildCompromisedColorInterval;
  @ViewChild('layer') private layer: AcLayerComponent;

  constructor(safehouseStore: SafehouseStore,
              private cesiumService: CesiumService,
              private alertService: AlertService) {

    this.buildings$ = safehouseStore.listenToBuildingInfo()
      .do(building => {
        if (building.status === BuildingStatus.Compromised) {
          this.alertService.playAlert();
          if (!this.buildCompromisedColorInterval) {
            this.startBuildingCompromisedInterval(building);
          }
        }
      })
      .map(building => ({
        id: building.id,
        actionType: ActionType.ADD_UPDATE,
        entity: Object.assign({}, building, {
          position: Cesium.Cartesian3.fromDegrees(building.position.lon, building.position.lat, building.position.alt),
          color: building.status === BuildingStatus.Compromised ? BUILDING_COLORS.COMPROMISED : BUILDING_COLORS.NORMAL,
        })
      }));
  }

  startBuildingCompromisedInterval(building) {
    let color = BUILDING_COLORS.COMPROMISED;
    this.buildCompromisedColorInterval = setInterval(() => {
      color = color === BUILDING_COLORS.COMPROMISED ? BUILDING_COLORS.NORMAL : BUILDING_COLORS.COMPROMISED;
      this.layer.update(Object.assign({}, building, {
        position: Cesium.Cartesian3.fromDegrees(building.position.lon, building.position.lat, building.position.alt),
        color,
      }), building.id);
    }, 1000);
  }

  async initialFlyTo({ cesiumEntity }) {
    if (!this.didFlyTo) {
      const viewer = this.cesiumService.getViewer();
      await viewer.flyTo(cesiumEntity);
      viewer.trackedEntity = cesiumEntity;
      this.didFlyTo = true;
    }
  }
}

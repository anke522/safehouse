import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType, CesiumService } from 'angular-cesium';
import { SafehouseStore } from '../../services/safehouse-store.service';

@Component({
  selector: 'safehouse-layer',
  templateUrl: './safehouse-layer.component.html',
  styleUrls: ['./safehouse-layer.component.css']
})
export class SafehouseLayer {

  buildings$: Observable<AcNotification>;
  didFlyTo = false;

  constructor(safehouseStore: SafehouseStore, private cesiumService: CesiumService) {
    safehouseStore.getSensors().subscribe(x => console.log('xxxxxxxxxxxxxxxxx => ', x));
    safehouseStore.listenToSensors().subscribe(x => console.log('xxxxxxxxxxxxxxxxx => ', x));

    this.buildings$ = safehouseStore.getBuildingInfo().map(building => ({
      id: building.id,
      actionType: ActionType.ADD_UPDATE,
      entity: Object.assign({}, building, {
        position: Cesium.Cartesian3.fromDegrees(building.position.lon, building.position.lat, building.position.alt)
      })
    }));
  }

  async initialFlyTo({cesiumEntity}) {
    if (!this.didFlyTo) {
      const viewer = this.cesiumService.getViewer();
      await viewer.flyTo(cesiumEntity);
      viewer.trackedEntity = cesiumEntity;
      this.didFlyTo = true;
    }
  }

}

import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { SafehouseStore } from '../../services/safehouse-store.service';

@Component({
  selector: 'buildings-layer',
  templateUrl: './buildings-layer.component.html',
  styleUrls: ['./buildings-layer.component.css']
})
export class BuildingsLayer {

  buildings$: Observable<AcNotification>;

  constructor(safehouseStore: SafehouseStore) {
    safehouseStore.getBuildingInfo().subscribe(x => console.log('xxxxxxxxxxxxxxxxx => ', x));
    safehouseStore.getSensors().subscribe(x => console.log('xxxxxxxxxxxxxxxxx => ', x));

    this.buildings$ = safehouseStore.getBuildingInfo().map(building => ({
      id: building.id,
      actionType: ActionType.ADD_UPDATE,
      entity: Object.assign({}, building, {
        position: Cesium.Cartesian3.fromDegrees(building.position.lon, building.position.lat, building.position.alt)
      })
    }));
  }

}

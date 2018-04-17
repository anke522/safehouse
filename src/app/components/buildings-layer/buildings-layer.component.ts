import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { SafehouseRepository } from '../../services/safehouse-repository.service';

@Component({
  selector: 'buildings-layer',
  templateUrl: './buildings-layer.component.html',
  styleUrls: ['./buildings-layer.component.css']
})
export class BuildingsLayer {

  buildings$: Observable<AcNotification>;

  constructor(safehouseRepository: SafehouseRepository) {
    this.buildings$ = safehouseRepository.getBuildings().map(building => ({
      id: building.id,
      actionType: ActionType.ADD_UPDATE,
      entity: Object.assign({}, building, {
        position: Cesium.Cartesian3.fromDegrees(building.position.lon, building.position.lat, building.position.alt)
      })
    }));
  }

}

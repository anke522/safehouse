import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ElasticWatcher } from '../../db/';
import { Sensor, SensorStatus, SensorType } from '../models';

export class SensorsListener {

  private _esWatcher: ElasticWatcher;

  constructor(watcher: ElasticWatcher) {
    this._esWatcher = watcher;
  }

  listenToDoorCamera(pollInterval: number): Observable<Sensor> {
    return this._esWatcher.watch({
      index: 'persondetect',
      type: '_doc',
      body: {
        query: {
          range: { timestamp: { gte: Date.now() - 15000, lt: Date.now() } }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return {
        id: 'door-camera',
        type: SensorType.Camera,
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        position: {
          lat: 0,
          lon: 0,
          alt: 0
        },
        related: []
      }
    });
  }

  listenToSafehouse() {

  }

  listenToAccessPoint() {

  }

  listenToCamera() {

  }
}

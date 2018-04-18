import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { getDoorCamera } from '../mocks';
import { ElasticWatcher } from '../../db/';
import { Sensor, SensorStatus } from '../models';

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

      return getDoorCamera({
        status: SensorStatus.Warning
      });
    });
  }

  listenToSafehouse() {

  }

  listenToAccessPoint() {

  }

  listenToCamera() {

  }
}

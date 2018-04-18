import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { getAccessPoint, getDoorCamera } from '../mocks';
import { ElasticWatcher } from '../../db/';
import { Sensor, SensorStatus } from '../models';

export class SensorsListener {

  private _esWatcher: ElasticWatcher;

  constructor(watcher: ElasticWatcher) {
    this._esWatcher = watcher;
  }

  listenToAccessPoint(pollInterval: number): Observable<Sensor> {
    return this._esWatcher.watch({
      index: 'safehouse-ap-devices-*',
      type: 'webhook',
      body: {
        query: {
          range: { timestamp: { gte: 'now-15s', lt: 'now' } }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getAccessPoint({
        // If unknown client attaches to the accessPoint, turn it YELLOW, otherwise make it BLACK
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Unknown client attaches to the access point' : ''
      });
    });
  }

  listenToDoorCamera(pollInterval: number): Observable<Sensor> {
    return this._esWatcher.watch({
      index: 'persondetect',
      type: '_doc',
      body: {
        query: {
          range: {timestamp: {gte: Date.now() - 15000, lt: Date.now()}}
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorCamera({
        // If person is detected by the doorCamera (persondetect), turn it WHITE, otherwise make it BLACK
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Person is detected by the doorCamera' : ''
      });
    });
  }
}


import { merge } from 'rxjs/observable/merge';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { getAccessPoint, getDoorCamera } from '../mocks';
import { ElasticWatcher } from '../../db/';
import { Sensor, SensorStatus } from '../models';
import { getMotionDetector } from '../mocks/motion-detector';
import { getDoorLock } from '../mocks/door-lock';
import { BuildingStatus } from '../models/building';

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
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Unknown client attached to access point' : ''
      });
    });
  }

  listenToDoorCamera(pollInterval: number): Observable<Sensor> {
    const personDetection$ = this._esWatcher.watch({
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
        status: hits > 0 ? SensorStatus.Engaged : SensorStatus.Normal,
        message: hits > 0 ? 'Person detected by door camera' : ''
      });
    });

    const unauthorizedConnection$ = this._esWatcher.watch({
      index: 'webcam-pcap-*',
      type: 'webhook',
      body: {
        query: {
          range: { timestamp: { gte: 'now-10s', lt: 'now' } }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorCamera({
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Unauthorized connection to door camera' : ''
      });
    });

    return merge(personDetection$, unauthorizedConnection$);
  }

  listenToMotionDetector(pollInterval: number): Observable<Sensor> {
    return this._esWatcher.watch({
      index: 'domoticz*',
      type: 'notification',
      body: {
        query: {
          bool: {
            must: { match: { message: "Motion" } },
            filter: [ { range: { timestamp: { gte: 'now-10s', lt: 'now' } } } ]
          }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getMotionDetector({
        status: hits > 0 ? SensorStatus.Engaged : SensorStatus.Normal,
        message: hits > 0 ? 'Motion detected by motion detector' : ''
      });
    });
  }

  listenToDoorLock(pollInterval: number): Observable<Sensor> {
    const manualUnlock1$ = this._esWatcher.watch({
      index: 'door-lock-*',
      type: 'webhook',
      body: {
        sort: { timestamp: { order: "desc" }},
        query: {
          bool: {
            must: { match: { user: "Manual Unlock" } },
            filter: [ { range: { timestamp: { gte: 'now-10s', lt: 'now' } } } ]
          }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorLock({
        status: hits > 0 ? SensorStatus.Engaged : SensorStatus.Normal,
        message: hits > 0 ? 'Door unlocked manually' : ''
      });
    });

    const manualUnlock2$ = this._esWatcher.watch({
      index: 'ifttt-*',
      type: 'webhook',
      body: {
        sort: { timestamp: { order: "desc" }},
        query: {
          bool: {
            must: { match: { user: "Manual Unlock" } },
            filter: [ { range: { timestamp: { gte: 'now-10s', lt: 'now' } } } ]
          }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorLock({
        status: hits > 0 ? SensorStatus.Engaged : SensorStatus.Normal,
        message: hits > 0 ? 'Door unlocked manually' : ''
      });
    });

    const nonManualUnlock1$ = this._esWatcher.watch({
      index: 'door-lock-*',
      type: 'webhook',
      body: {
        sort: { timestamp: { order: "desc" }},
        query: {
          bool: {
            must_not: { match: { user: "Manual Unlock" } },
            filter: [ { range: { timestamp: { gte: 'now-10s', lt: 'now' } } } ]
          }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorLock({
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Door unlocked non-manually' : ''
      });
    });

    const nonManualUnlock2$ = this._esWatcher.watch({
      index: 'ifttt-*',
      type: 'webhook',
      body: {
        sort: { timestamp: { order: "desc" }},
        query: {
          bool: {
            must_not: { match: { user: "Manual Unlock" } },
            filter: [ { range: { timestamp: { gte: 'now-10s', lt: 'now' } } } ]
          }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return getDoorLock({
        status: hits > 0 ? SensorStatus.Warning : SensorStatus.Normal,
        message: hits > 0 ? 'Door unlocked non-manually' : ''
      });
    });

    return merge(manualUnlock1$, manualUnlock2$, nonManualUnlock1$, nonManualUnlock2$);
  }

  listenToSafehouseStatus(pollInterval: number): Observable<BuildingStatus> {
    return this._esWatcher.watch({
      index: 'sfalgo',
      type: '_doc',
      body: {
        query: {
          range: { DateTime: { gte: Date.now() - 10000, lt: Date.now() } }
        }
      }
    }, pollInterval).map(resp => {
      const hits = (resp.hits && resp.hits.hits.length) || 0;

      return hits > 0 ? BuildingStatus.Normal : BuildingStatus.Compromised;
    });
  }
}


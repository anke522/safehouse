import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import {Client, SearchParams, SearchResponse} from 'elasticsearch';

function sleep(timeMS: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, timeMS));
}

export interface ElasticWatcherOptions {
  host: string;
  httpAuth: string;
}

export class ElasticWatcher {

  private _esClient: Client;

  constructor({host, httpAuth = ''}: ElasticWatcherOptions) {
    this._esClient = new Client({host, httpAuth});
  }

  watch<T>(search: SearchParams, timeMS: number): Observable<SearchResponse<T>> {
    let stop = false;

    const searchFn = async (search: SearchParams, observer: Subscriber<SearchResponse<T>>) => {
      if (stop) {
        return;
      }

      const response = await this._esClient.search<T>(search);
      observer.next(response);
      await sleep(timeMS);
      searchFn(search, observer);
    };

    return Observable.create(observer => {
      searchFn(search, observer);

      return () => stop = true;
    });
  }
}

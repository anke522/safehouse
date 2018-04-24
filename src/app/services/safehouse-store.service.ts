import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/switchMap';

import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { ApolloClient, ObservableQuery } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Building } from '../models/building';
import { Sensor } from '../models/sensor';

@Injectable()
export class SafehouseStore {

  private _client: ApolloClient<any>;

  constructor() {
    this._client = new ApolloClient({
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        new HttpLink({
          uri: environment.graphql_url || 'http://localhost:3000/graphql'
        })
      ]),
      cache: new InMemoryCache()
    });
  }

  listenToBuildingInfo(pollInterval = 1000):  Observable<Building> {
    return Observable.create(observer=>{
      this._client.watchQuery<any>({
        pollInterval,
        query: gql`
          query safehouse {
            safehouse {
              id
              name
              status
              position {
                lat
                lon
                alt
              }
            }
          }
        `
      }).subscribe(result=> {
        observer.next(result.data.safehouse)
      })
    });
  }

  getSensors(): Observable<Array<Sensor>> {
    return Observable.fromPromise(this._client.query({
      query: gql`
          query safehouse {
            safehouse {
              id
              sensors {
                id
                type
                name
                status
                message
                position {
                  lat
                  lon
                  alt
                }
                related {
                  id
                }
              }
            }
          }
        `
    })).switchMap(({data}) => Observable.from(Array.isArray(data['safehouse'].sensors) ? data['safehouse'].sensors : []));
  }

  listenToSensors(pollInterval?: number): Observable<Sensor[]> {
    return Observable.create(observer => {
      const subscription = this._client.watchQuery({
        pollInterval: pollInterval || 1000,
        fetchPolicy: "network-only",
        query: gql`
          query safehouse {
            safehouse {
              id
              status
              sensors {
                id
                type
                name
                status
                message
                position {
                  lat
                  lon
                  alt
                }
                related {
                  id
                  status
                  position {
                    lat
                    lon
                    alt
                  }
                }
              }
            }
          }
        `
      }).subscribe(({data}) => {
        const sensors = Array.isArray(data['safehouse'].sensors) ? data['safehouse'].sensors : [];
        observer.next(sensors)
      });
    });
  }
}

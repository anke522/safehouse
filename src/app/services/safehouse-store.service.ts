import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/merge';

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
          uri: 'http://localhost:3000/graphql'
        })
      ]),
      cache: new InMemoryCache()
    });
  }

  getBuildingInfo(): Observable<Building> {
    return Observable.fromPromise(this._client.query({
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
    })).map(({data}) => Object.assign({}, data['safehouse'], {sensors: []}));
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
    })).map(({data}) => Array.isArray(data['safehouse'].sensors) ? data['safehouse'].sensors : []);

  }

  listenToSensors() {

  }
}

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

@Injectable()
export class SafehouseRepository {

  private _client: ApolloClient<any>;
  private _buildingsQuery: ObservableQuery<any>;
  private _buildingsSubject: Subject<Building>;
  private _buildingsStore: Map<string, Building>;

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

  getBuildings(): Observable<Building> {
    if (!this._buildingsQuery) {
      this._buildingsQuery = this._client.watchQuery({
        fetchPolicy: "network-only",
        pollInterval: 1000,
        query: gql`
          query buildings {
            buildings {
              id
              name
              color
              position {
                lat
                lon
                alt
              }
            }
          }
        `
      });

      this._buildingsSubject = new Subject<Building>();
      this._buildingsStore = new Map<string, Building>();

      this._buildingsSubject.subscribe(building => {
        this._buildingsStore.set(building.id, building);
      });

      this._buildingsQuery.subscribe(({data}) => {
        const buildings = Array.isArray(data.buildings) ? data.buildings : [];
        buildings.forEach(building => this._buildingsSubject.next(building));
      });
    }

    return Observable.from(Array.from(this._buildingsStore.values())).merge(this._buildingsSubject);
  }
}

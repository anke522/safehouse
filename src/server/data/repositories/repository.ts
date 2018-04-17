import { Observable } from 'rxjs/Observable';

export enum Action {
  ADD,
  UPDATE,
  REMOVE
}

export interface ChangeNotification<K, V> {
  id: K,
  value: V,
  action: Action
}

export interface Repository<K, V> {
  getAll(): V[];
  getById(id: K): V;
  add(id: K, value: V): void;
  update(id: K, value: V): void;
  remove(id: K): void;
  onChange(): Observable<ChangeNotification<K, V>>;
}

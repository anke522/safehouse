import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Repository, ChangeNotification, Action } from './repository';

export abstract class BasicRepository<K, V> implements Repository<K, V> {
  private _store: Map<K, V>;
  private _subject: Subject<ChangeNotification<K, V>>;

  constructor() {
    this._store = new Map<K, V>();
    this._subject = new Subject<ChangeNotification<K, V>>();
  }

  getAll(): V[] {
    return Array.from(this._store.values());
  }

  getById(id: K): V {
    return this._store.get(id);
  }

  add(id: K, value: V): void {
    this._store.set(id, value);
    this._subject.next({action: Action.ADD, id, value});
  }

  update(id: K, value: V): void {
    this._store.set(id, value);
    this._subject.next({action: Action.UPDATE, id, value});
  }

  remove(id: K): void {
    if (!this._store.has(id)) {
      return;
    }

    const value = this._store.get(id);
    this._store.delete(id);
    this._subject.next({action: Action.REMOVE, id, value});
  }

  onChange(): Observable<ChangeNotification<K, V>> {
    return this._subject.asObservable();
  }
}

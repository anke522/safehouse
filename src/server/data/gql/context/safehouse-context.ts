import { Building } from '../../models';
import { SafehouseStore } from '../../store';

export interface SafehouseContext {
  safehouseStore: SafehouseStore;
}

export const createSafehouseContext = (building: Building): SafehouseContext => ({
  safehouseStore: new SafehouseStore(building)
});

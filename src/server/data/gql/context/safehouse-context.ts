import { Safehouse } from '../../models';
import { SafehouseStore } from '../../store';

export interface SafehouseContext {
  safehouseStore: SafehouseStore;
}

export const createSafehouseContext = (building: Safehouse): SafehouseContext => ({
  safehouseStore: new SafehouseStore(building)
});

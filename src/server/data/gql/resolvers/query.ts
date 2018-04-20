import { SafehouseContext } from '../context';

export const queryResolver =  {
  Query: {
    safehouse: (obj, args, context: SafehouseContext) => context.safehouseStore.getState(),
  }
};

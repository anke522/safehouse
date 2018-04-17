import { SafehouseContext } from '../context';

export const queryResolver =  {
  Query: {
    sensors: (obj, args, context: SafehouseContext) => context.sensorsRepository.getAll(),
    buildings: (obj, args, context: SafehouseContext) => context.buildingsRepository.getAll()
  }
};

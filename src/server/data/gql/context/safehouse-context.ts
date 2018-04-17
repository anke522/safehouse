import { BuildingsRepository, SensorsRepository } from '../../repositories';

export interface SafehouseContext {
  sensorsRepository: SensorsRepository;
  buildingsRepository: BuildingsRepository;
}

export const createSafehouseContext = (): SafehouseContext => ({
  sensorsRepository: new SensorsRepository(),
  buildingsRepository: new BuildingsRepository()
});

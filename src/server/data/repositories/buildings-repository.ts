import { Building } from '../models';
import { BasicRepository } from './basic-repository';

export class BuildingsRepository extends BasicRepository<string, Building> {}

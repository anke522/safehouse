import { Sensor } from '../models';
import { BasicRepository } from './basic-repository';

export class SensorsRepository extends BasicRepository<string, Sensor> {}

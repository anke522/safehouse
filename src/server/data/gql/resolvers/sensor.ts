import { SafehouseContext } from '../context';
import { SensorStatus } from '../../models';

export const sensorResolver =  {
  Sensor: {
    related: (sensor, args, context: SafehouseContext) => sensor.related
      .map(sensorId => context.safehouseStore.getSensorById(sensorId)),
    status: (sensor) => SensorStatus[sensor.combinedStatus || sensor.status],
  },
};

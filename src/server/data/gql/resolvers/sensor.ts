import { SafehouseContext } from '../context';

export const sensorResolver =  {
  Sensor: {
    related: (sensor, args, context: SafehouseContext) => sensor.related
      .map(sensorId => context.safehouseStore.getSensorById(sensorId)),
    status: (sensor) => sensor.combinedStatus || sensor.status
  }
};

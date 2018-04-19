import { BuildingStatus } from '../../models';

export const buildingResolver =  {
  Building: {
    status: (sensor) => BuildingStatus[sensor.status],
  },
};

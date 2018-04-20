import { BuildingStatus } from '../../models';

export const buildingResolver =  {
  Building: {
    status: (building) => BuildingStatus[building.status],
  },
};

import { SafehouseStatus, SensorStatus, SensorType } from "../models";

export const safehosue = {
  id: 'safe-house',
  name: 'safehouse',
  status: SafehouseStatus.Normal,
  position: {
    lon: -82.4374762,
    lat: 27.9561611,
    alt: 0.0
  },
  sensors: [
    {
      id: 'access-point',
      type: SensorType.AccessPoint,
      status: SensorStatus.Normal,
      position: {
        lat: 0,
        lon: 0,
        alt: 0
      },
      related: ['door-camera']
    },
    {
      id: 'door-camera',
      type: SensorType.Camera,
      status: SensorStatus.Normal,
      position: {
        lat: 0,
        lon: 0,
        alt: 0
      },
      related: ['access-point']
    }
  ]
};

import gql from 'graphql-tag';

export const safehouseType = gql`
  type Safehouse {
    id: String
    name: String
    status: String
    position: Position
    sensors: [Sensor]
  }
`;

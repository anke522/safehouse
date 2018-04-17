import gql from 'graphql-tag';

export const sensorType = gql`
  type Sensor {
    id: String
    type: String
    status: String
    position: Position
    related: [Sensor]
  }
`;

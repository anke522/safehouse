import gql from 'graphql-tag';

export const sensorType = gql`
  type Sensor {
    id: String
    type: String
    name: String
    status: String
    position: Position
    message: String
    related: [Sensor]
  }
`;

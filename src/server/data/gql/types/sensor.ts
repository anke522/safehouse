import gql from 'graphql-tag';

export const sensorType = gql`
  type Sensor {
    id: Int
    name: String
    color: String
    position: Position
  }
`;

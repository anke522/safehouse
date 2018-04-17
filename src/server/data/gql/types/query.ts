import gql from 'graphql-tag';

export const queryType = gql`
  type Query {
    sensors: [Sensor]
    buildings: [Building]
  }
`;

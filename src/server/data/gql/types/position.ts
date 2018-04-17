import gql from 'graphql-tag';

export const positionType = gql`
  type Position {
    lat: Float
    lon: Float
    alt: Float
  }
`;

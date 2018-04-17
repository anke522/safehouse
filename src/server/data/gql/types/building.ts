import gql from 'graphql-tag';

export const buildingType = gql`
  type Building {
    id: String
    name: String
    color: String
    position: Position
  }
`;

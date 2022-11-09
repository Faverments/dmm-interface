import { gql } from '@apollo/client'

const ReportNftCollection = gql`
  mutation ReportNftCollection(
    $collectionName: String!
    $description: String
    $userAddress: String
    $violation: ReportViolation!
  ) {
    reportNftCollection(
      input: {
        collectionName: $collectionName
        description: $description
        userAddress: $userAddress
        violation: $violation
      }
    ) {
      success
    }
  }
`

const SearchResultAccepted = gql`
  mutation SearchResultAccepted($input: SearchResultAcceptedInput!) {
    triggerSearchResultAccepted(input: $input) {
      accepted
    }
  }
`

export { ReportNftCollection, SearchResultAccepted }

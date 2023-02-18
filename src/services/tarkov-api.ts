import { gql } from "../__generated__/gql";

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

const link = createHttpLink({
  uri: "https://api.tarkov.dev/graphql",
});

export const tarkovClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export const GET_PEACEKEEPER_ITEMS = gql(/* GraphQL */ `
  query GetPeacekeeperItems {
    infoItems: items(categoryNames: [Info]) {
      id
      name
      lastLowPrice
      avg24hPrice
      sellFor {
        price
        currency
        priceRUB
        vendor {
          name
        }
      }
    }
    usd: items(name: "USD") {
      id
      buyFor {
        price
        currency
        priceRUB
        vendor {
          name
        }
      }
    }
  }
`);

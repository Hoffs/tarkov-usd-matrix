import { h } from "preact";

import Header from "./header";
import ItemTable from "../components/item-table";
import { tarkovClient } from "../services/tarkov-api";

import { ApolloProvider } from "@apollo/client";
import { useState } from "preact/hooks";

export const App = () => {
  const [rubToUsd, setRubToUsd] = useState<number | null>(null);
  return (
    <ApolloProvider client={tarkovClient}>
      <div id="app">
        <Header />
        <main>
          {/* TODO: Move this to a component */}
          {/* TODO: Maybe use local storage to persist this value */}
          {/* TODO: Investigate if there is a way to get precise/realtime price of USD */}
          <div>
            <span>Override USD price:</span>
            <input
              type="number"
              value={rubToUsd}
              onChange={(e) => setRubToUsd(Number(e.currentTarget.value))}
            />
          </div>
          <ItemTable overrideRubToUsd={rubToUsd} />
        </main>
        {/* TODO: Add footer with link to tarkov.dev */}
      </div>
    </ApolloProvider>
  );
};

export default App;

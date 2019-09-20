import React from "react";
import { UserProvider, BuildWeekProvider } from "./allContexts";

function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids
      }),

    children
  );
}

function ContextProvider({ children }) {
  return (
    <ProviderComposer contexts={[<UserProvider />, <BuildWeekProvider />]}>
      {children}
    </ProviderComposer>
  );
}

export { ContextProvider };

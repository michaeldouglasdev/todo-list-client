"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

interface AppProviderProps {
  children: React.ReactNode;
}
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          todo: (_, { args, toReference }) => {
            return toReference({
              __typename: "Todo",
              id: args?.id,
            });
          },
          search: {
            keyArgs: false, // Não utiliza args para gerar a chave
            read(
              existing = {},
              {
                args: {
                  data: {
                    pagination: { offset = 0, limit = 10 },
                  },
                },
              }
            ) {
              console.log("existing", existing);
              // Retorna os resultados existentes do cache para a paginação
              const a = existing.results?.slice(offset, offset + limit);
              console.log("a", a);
              return a;
            },

            merge(
              existing = { results: [] },
              incoming,
              {
                args: {
                  data: {
                    pagination: { offset = 0 },
                  },
                },
              }
            ) {
              // Mescla os resultados existentes com os novos resultados
              const merged = existing.results.slice(0);
              for (let i = 0; i < incoming.results.length; ++i) {
                merged[offset + i] = incoming.results[i];
              }
              return { results: merged };
            },
          },
        },
      },
    },
  }),
  uri: "http://localhost:4001/graphql",
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
};

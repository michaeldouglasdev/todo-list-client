"use client";

import { useQuery } from "@apollo/client";
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { SEARCH_TODO } from "../graphql/queries/queries";
import styles from "./page.module.css";

export default function () {
  const { data, fetchMore } = useQuery(SEARCH_TODO, {
    variables: {
      data: {
        pagination: {},
      },
    },
  });

  const onScrollEnd = () => {
    console.log("onscroll");
    fetchMore({
      variables: {
        data: {
          pagination: {
            offset: 10,
          },
        },
      },
      updateQuery(
        previousData,
        {
          fetchMoreResult,
          variables: {
            data: {
              pagination: { offset },
            },
          },
        }
      ) {
        console.log("previousData", previousData);
        console.log("fetchMoreResult", fetchMoreResult);
        const updatedFeed = previousData.search.results.slice(0);
        for (let i = 0; i < fetchMoreResult.search.results.length; ++i) {
          updatedFeed[offset + i] = fetchMoreResult.search.results[i];
        }
        return { ...previousData, search: { results: updatedFeed } };
      },
    });
  };

  return (
    <div className={styles.main}>
      <Button onClick={onScrollEnd}>Fetch</Button>
      <List>
        {data?.search?.results?.map((todo: any) => (
          <ListItem>
            <ListItemButton>
              <ListItemText primary={todo.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

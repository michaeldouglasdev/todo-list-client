"use client";

import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import router, { useRouter } from "next/navigation";
import { GET_TODO } from "../../graphql/queries/queries";

export default function (props: any) {
  const { data } = useQuery(GET_TODO, {
    variables: {
      id: props.params.id,
    },
  });

  return (
    <Grid container flexDirection="column" justifyContent="center">
      <Grid item>
        <h1 style={{ textAlign: "center" }}>{data?.todo.name}</h1>
      </Grid>
      <Grid item display="flex" justifyContent="center">
        <span>{data?.todo.description}</span>
      </Grid>
      <Grid item display="flex" justifyContent="center">
        <span>{data?.todo.id}</span>
      </Grid>
    </Grid>
  );
}

"use client";
import { useFragment, useMutation, useQuery } from "@apollo/client";
import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import Table from "../components/table/table";
import {
  CREATE_TODO,
  LIST_TODOS,
  UPDATE_TODO,
} from "../graphql/queries/queries";
import styles from "./page.module.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Dialog from "../components/update-dialog/update-dialog";

type Inputs = {
  name: string;
  description: string;
};

type Todo = {
  id?: string;
  name: string;
  description: string;
};
export default function () {
  const [isOpenedDialog, setOpenDialog] = useState(false);
  const { data } = useQuery(LIST_TODOS);
  const [createTodo, dataCreatedTodo] = useMutation(CREATE_TODO);
  const [updateTodo, dataUpdateTodo] = useMutation(UPDATE_TODO);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [selectedTodo, setSelectedTodo] = useState<Todo>();

  const handleCreateTodo = (data: Todo) => {
    console.log("handlecreate", data);
    createTodo({
      variables: {
        data: {
          name: data.name,
          description: data.description,
        },
      },
      update(cache, { data: { createTodo } }) {
        const data = { ...cache.readQuery<any>({ query: LIST_TODOS }) };
        const todos = [...data.todos];
        todos.push(createTodo);

        const allTodos = {
          todos: todos,
        };
        cache.writeQuery({ query: LIST_TODOS, data: allTodos });
      },
      /*optimisticResponse: {
        createTodo: {
          id: "temp-id",
          __typename: "Todo",
          name: data.name,
          description: data.description,
        },
      },*/
    });
  };

  const handleDeleteTodo = () => {
    console.log("handleDeleteTodo");
  };

  const handleCreateOrUpdateTodo = (todo: Todo) => {
    if (todo.id) {
      handleUpdateTodo(todo);
    } else {
      handleCreateTodo(todo);
    }
  };
  const handleUpdateTodo = (todo: Todo) => {
    updateTodo({
      variables: {
        data: {
          ...todo,
        },
      },
    });
  };

  const handleOpenDialog = (
    id: string | undefined,
    action: "create" | "update"
  ) => {
    if (action === "update") {
      setSelectedTodo(data.todos.find((todo: Todo) => todo.id === id));
    }
    setOpenDialog(true);
  };

  const renderView = (params: any) => {
    return (
      <strong>
        <Button color="primary">
          <Link href={`/todo/${params.id}`}>View</Link>
        </Button>
      </strong>
    );
  };
  const renderDelete = (params: any) => {
    return (
      <strong>
        <Button onClick={handleDeleteTodo} color="error">
          Delete
        </Button>
      </strong>
    );
  };

  const renderUpdate = (params: any) => {
    return (
      <strong>
        <Button
          onClick={() => handleOpenDialog(params.id, "update")}
          color="info"
        >
          Update
        </Button>
      </strong>
    );
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTodo(undefined);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "view",
      headerName: "",
      width: 150,
      renderCell: renderView,
    },
    {
      field: "update",
      headerName: "",
      width: 150,
      renderCell: renderUpdate,
    },
    {
      field: "delete",
      headerName: "",
      width: 150,
      renderCell: renderDelete,
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.buttonsSections}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleOpenDialog(undefined, "create")}
          >
            Create TODO
          </Button>
        </div>
        <DataGrid
          rows={data?.todos}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
      <Dialog
        open={isOpenedDialog}
        onClose={handleCloseDialog}
        onSubmit={handleCreateOrUpdateTodo}
        todo={selectedTodo!}
      />
    </div>
  );
}

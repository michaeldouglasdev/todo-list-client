import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogMUI from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText } from "@mui/material";

type Inputs = {
  name: string;
  description: string;
};

type Todo = {
  id?: string;
  name: string;
  description: string;
};

interface DialogProps {
  onSubmit: (todo: Todo) => void;
  onClose: () => void;
  open: boolean;
  todo?: Todo;
}
export default function Dialog(props: DialogProps) {
  return (
    <DialogMUI
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const todo = {
            id: props?.todo?.id,
            name: formJson.name,
            description: formJson.description,
          };
          props.onSubmit(todo);
          props.onClose();
        },
      }}
    >
      <DialogTitle>{props.todo ? "Update" : "Create"}</DialogTitle>

      <DialogContent>
        {props.todo && (
          <TextField
            id="id"
            name="id"
            value={props.todo?.id}
            label="ID"
            disabled
            variant="standard"
            fullWidth
            margin="dense"
          />
        )}
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Name"
          fullWidth
          variant="standard"
          defaultValue={props.todo?.name}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="description"
          name="description"
          label="Description"
          fullWidth
          variant="standard"
          defaultValue={props.todo?.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button type="submit">{props?.todo ? "Update" : "Create"}</Button>
      </DialogActions>
    </DialogMUI>
  );
}

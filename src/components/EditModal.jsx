import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const EditModal = ({ open, handleClose, rowData, handleUpdate, roomDetails }) => {
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id,
    Name: rowData.Name,
    ...roomDetails.reduce((acc, room) => {
      acc[`R${room.id}`] = rowData.Skills && rowData.Skills[`R${room.id}`] ? rowData.Skills[`R${room.id}`] : "0";
      return acc;
    }, {}),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Gọi hàm handleUpdate để cập nhật dữ liệu
    handleUpdate(updatedData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Doctor</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="Name"
          value={updatedData.Name}
          onChange={handleChange}
        />
        {roomDetails.map((room) => (
          <TextField
            key={room.id}
            fullWidth
            margin="normal"
            label={`${room.name}`}
            name={`R${room.id}`}
            value={updatedData[`R${room.id}`]}
            onChange={handleChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;

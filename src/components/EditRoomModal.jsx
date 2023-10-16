import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const EditRoomModal = ({ open, handleClose, rowData, handleUpdate }) => {
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id,
    name: rowData.name,
    load: rowData.load,
    priority: rowData.priority,
  });

  useEffect(() => {
    // Update the state when the rowData prop changes
    setUpdatedData({
      id: rowData.id,
      name: rowData.name,
      load: rowData.load,
      priority: rowData.priority,
    });
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleConfirmUpdate = () => {
    // Call API to update data
    handleUpdate(updatedData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Room Details
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={updatedData.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Load"
          name="load"
          value={updatedData.load}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Priority"
          name="priority"
          value={updatedData.priority}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmUpdate}
        >
          Confirm Update
        </Button>
      </Box>
    </Modal>
  );
};

export default EditRoomModal;
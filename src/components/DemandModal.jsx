import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const DemandModal = ({ open, handleClose, rowData, handleUpdate }) => {
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id || "",
    roomName: rowData.roomName || "",
    demand0: rowData.demand0 || "",
    demand1: rowData.demand1 || "",
    demand2: rowData.demand2 || "",
  });

  // Update the local state whenever rowData prop changes
  useEffect(() => {
    if (rowData) {
      setUpdatedData({
        id: rowData.id || "",
        roomName: rowData.roomName || "",
        demand0: rowData.demand0 || "",
        demand1: rowData.demand1 || "",
        demand2: rowData.demand2 || "",
      });
    }
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleConfirmUpdate = () => {
    // Call API to update demand data
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
          Edit Demand Details
        </Typography>
        <TextField
          fullWidth
          label="Room Name"
          name="roomName"
          value={updatedData.roomName}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Demand Level 0"
          name="demand0"
          value={updatedData.demand0}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Demand Level 1"
          name="demand1"
          value={updatedData.demand1}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Demand Level 2"
          name="demand2"
          value={updatedData.demand2}
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

export default DemandModal;

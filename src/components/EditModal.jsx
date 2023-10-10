import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useEffect } from "react";

const EditModal = ({ open, handleClose, rowData, handleUpdate }) => {
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id,
    Name: rowData.Name,
    R1: rowData.R1,
    R2: rowData.R2,
    R3: rowData.R3,
    R4: rowData.R4,
    R5: rowData.R5,
    R6: rowData.R6,
    R7: rowData.R7,
    workload: rowData.workload,
  });

  useEffect(() => {
    // Log whenever the rowData prop changes
    console.log("rowData changed:", rowData);
    // Update the state when the rowData prop changes
    setUpdatedData({
      id: rowData.id,
      Name: rowData.Name,
      R1: rowData.R1,
      R2: rowData.R2,
      R3: rowData.R3,
      R4: rowData.R4,
      R5: rowData.R5,
      R6: rowData.R6,
      R7: rowData.R7,
      workload: rowData.workload,
    });
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleConfirmUpdate = () => {
    // Call API to update data
    handleUpdate(updatedData);
    // console.log("updatedData", updatedData);
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
          Edit Doctor Details
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="Name"
          value={updatedData.Name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R1"
          name="R1"
          value={updatedData.R1}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R2"
          name="R2"
          value={updatedData.R2}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R3"
          name="R3"
          value={updatedData.R3}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R4"
          name="R4"
          value={updatedData.R4}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R5"
          name="R5"
          value={updatedData.R5}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R6"
          name="R6"
          value={updatedData.R6}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="R7"
          name="R7"
          value={updatedData.R7}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Workload"
          name="workload"
          value={updatedData.workload}
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

export default EditModal;

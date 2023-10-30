import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

const EditModal = ({
  open,
  handleClose,
  rowData,
  handleUpdate,
  roomDetails,
}) => {
  {
    // console.log(1111, rowData);
  }
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id,
    Name: rowData.Name,
    ...roomDetails.reduce((acc, room) => {
      const roomKey = `R${room.id}`;
      acc[roomKey] = rowData[roomKey] || "0";
      return acc;
    }, {}),
  });

  useEffect(() => {
    setUpdatedData((prevData) => ({
      ...prevData,
      id: rowData.id,
      Name: rowData.Name,
      ...roomDetails.reduce((acc, room) => {
        const roomKey = `R${room.id}`;
        acc[roomKey] = rowData[roomKey] || "0";
        return acc;
      }, {}),
    }));
  }, [rowData, roomDetails]);

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
          <div key={room.id} style={{ marginTop: "10px" }}>
            <label>{room.name}</label>
            <Select
              fullWidth
              name={`R${room.id}`}
              value={updatedData[`R${room.id}`]}
              onChange={handleChange}
              variant="outlined"
            >
              <MenuItem value="0">Không kinh nghiệm</MenuItem>
              <MenuItem value="1">Làm được</MenuItem>
              <MenuItem value="2">Làm tốt</MenuItem>
            </Select>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;

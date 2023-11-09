import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import plugin UTC
import timezone from "dayjs/plugin/timezone"; // Import plugin Timezone
import "dayjs/locale/vi";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchDataFromAPI } from "../data/api";

dayjs.locale("vi");
dayjs.extend(utc); // Enable UTC plugin
dayjs.extend(timezone); // Enable Timezone plugin

const EditAssignModal = ({ open, handleClose, rowData, handleUpdate }) => {
  const [updatedData, setUpdatedData] = useState({
    id: rowData.id,
    room: rowData.room,
    date: dayjs(rowData.date).tz("Asia/Ho_Chi_Minh"),
    doctor_id: rowData.doctor_id,
    isOnLeave: rowData.room === -1,
    apm: rowData.session % 2,
  });

  const [roomDropdownDisabled, setRoomDropdownDisabled] = useState(
    rowData.room === -1
  );
  const [roomDetails, setRoomDetails] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [isMorning, setIsMorning] = useState(false);
  const [isAfternoon, setIsAfternoon] = useState(false);
  // console.log(rowData.session, isMorning, isAfternoon);

  useEffect(() => {
    const parsedDate = dayjs(rowData.date);
    // console.log(111, rowData);
    // Update the state when the rowData prop changes
    setIsMorning(rowData.session % 2 === 0);
    setIsAfternoon(rowData.session % 2 === 1);
    setUpdatedData({
      id: rowData.id,
      room: rowData.room,
      date: parsedDate,
      doctor_id: rowData.doctor_id,
      isOnLeave: rowData.room === -1,
      apm: isMorning ? 0 : isAfternoon ? 1 : null,
    });
    setRoomDropdownDisabled(rowData.room === -1);
  }, [rowData]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        // console.log("room", response);
        setRoomDetails(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/dr_detail.php");
        // console.log("doctor", response);
        setDoctorDetails(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorDetails();
    fetchRoomDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setUpdatedData({
      ...updatedData,
      isOnLeave: checked,
      room: checked ? -1 : rowData.room,
    });
    setRoomDropdownDisabled(checked);
    console.log(111, updatedData);
  };

  const handleConfirmUpdate = () => {
    // Call API to update data
    console.log(updatedData.date);
    handleUpdate(updatedData);
    handleClose();
  };

  const handleMorningChange = (event) => {
    setIsMorning(event.target.checked);
    setIsAfternoon(!event.target.checked); // Uncheck afternoon if morning is checked
  };

  const handleAfternoonChange = (event) => {
    setIsAfternoon(event.target.checked);
    setIsMorning(!event.target.checked); // Uncheck morning if afternoon is checked
  };

  const handleDateChange = (value) => {
    // console.log(111, value);
    const indochinaDate = dayjs(value).tz("Asia/Ho_Chi_Minh");
    setUpdatedData({ ...updatedData, date: indochinaDate });
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
          Edit Assignment Details
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="room-label">Room</InputLabel>
          <Select
            labelId="room-label"
            id="room-select"
            value={updatedData.room}
            label="Room"
            name="room"
            onChange={handleInputChange}
            disabled={roomDropdownDisabled}
          >
            {/* Render room options */}
            {roomDetails.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={updatedData.isOnLeave}
              onChange={handleCheckboxChange}
            />
          }
          label="Nghỉ phép"
        />
        <FormControlLabel
          control={
            <Checkbox checked={isMorning} onChange={handleMorningChange} />
          }
          label="Buổi Sáng"
        />
        <FormControlLabel
          control={
            <Checkbox checked={isAfternoon} onChange={handleAfternoonChange} />
          }
          label="Buổi Chiều"
        />

        {/* chọn ngày */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DatePicker
              label="Controlled picker"
              value={updatedData.date}
              onChange={handleDateChange}
            />
          </DemoContainer>
        </LocalizationProvider>

        {/* Dropdown list cho bác sĩ */}
        <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
          <InputLabel id="doctor-label">Doctor</InputLabel>
          <Select
            labelId="doctor-label"
            id="doctor-select"
            value={updatedData.doctor_id}
            label="Doctor"
            onChange={(event) =>
              setUpdatedData({ ...updatedData, doctor_id: event.target.value })
            }
          >
            {/* {console.log(111, doctorDetails)} */}
            {doctorDetails.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmUpdate}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default EditAssignModal;

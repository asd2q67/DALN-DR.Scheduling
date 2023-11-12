import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import plugin UTC
import timezone from "dayjs/plugin/timezone"; // Import plugin Timezone
import "dayjs/locale/en"; // Import English locale for dayjs
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Header from "../../components/Header";
import { fetchDataFromAPI, postDataToAPI } from "../../data/api"; // Import các hàm gửi yêu cầu API từ module api của bạn
import "./style.css";
import { tokens } from "../../theme";

dayjs.extend(utc); // Enable UTC plugin
dayjs.extend(timezone); // Enable Timezone plugin

const WorkAssign = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isSuccess, setIsSuccess] = useState(false);
  const [roomDetails, setRoomDetails] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(
    dayjs().utcOffset(7 * 60)
  );
  const [isMorning, setIsMorning] = useState(true);
  const [isAfternoon, setIsAfternoon] = useState(false);
  const [isOnLeave, setIsOnLeave] = useState(false);
  const [roomDropdownDisabled, setRoomDropdownDisabled] = useState(false);

  useEffect(() => {
    // Gọi API để lấy chi tiết các phòng và cập nhật vào state roomDetails
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        // console.log("room", response);
        setRoomDetails(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    // Gọi API để lấy chi tiết các bác sĩ và cập nhật vào state doctorDetails
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/dr_detail.php");
        console.log("doctor", response);
        setDoctorDetails(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchRoomDetails();
    fetchDoctorDetails();
  }, []);

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleDateChange = (value) => {
    // console.log(111, value);
    const indochinaDate = dayjs(value).tz("Asia/Ho_Chi_Minh");
    setSelectedDate(indochinaDate);
  };
  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };
  const handleLeaveChange = (event) => {
    setIsOnLeave(event.target.checked);
    setRoomDropdownDisabled(event.target.checked);
  };
  const handleMorningChange = (event) => {
    setIsMorning(event.target.checked);
    setIsAfternoon(!event.target.checked); // Uncheck afternoon if morning is checked
  };

  const handleAfternoonChange = (event) => {
    setIsAfternoon(event.target.checked);
    setIsMorning(!event.target.checked); // Uncheck morning if afternoon is checked
  };

  const handleFormSubmit = async () => {
    try {
      const roomId = isOnLeave ? -1 : selectedRoom;
      // Gửi yêu cầu POST đến API để tạo công việc mới
      const data = {
        room: roomId,
        date: selectedDate,
        doctor_id: selectedDoctor,
        apm: isMorning ? 0 : isAfternoon ? 1 : null,
        doctorNum: doctorDetails.length,
      };
      const response = await postDataToAPI("/work_assign.php", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(222, selectedDate);
      setIsSuccess(true);

      // Reset form và ẩn thông báo thành công sau 2 giây
      setTimeout(() => {
        setIsSuccess(false);
        //resetForm();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (isSuccess) {
      // Hide the alert after 5 seconds
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    }

    // Clear the timer if the component unmounts or if isSuccess becomes false
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  return (
    <Box m="20px">
      <Header title="WORK ASSIGN" subtitle="Đăng ký lịch làm việc" />

      <div className={`custom-alert ${isSuccess ? "" : "hide-alert"}`}>
        Cập nhật lịch làm việc thành công!
      </div>

      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderColor: colors.blueAccent[400],
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <Box>
          <FormControl sx={{ mb: 2, width: "200px" }}>
            <InputLabel sx={{ color: colors.blueAccent[400] }} id="room-label">
              Chọn Phòng
            </InputLabel>
            <Select
              labelId="room-label"
              id="room-select"
              value={selectedRoom}
              label="Chọn Phòng"
              onChange={handleRoomChange}
              disabled={roomDropdownDisabled}
            >
              {roomDetails.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOnLeave}
                  onChange={handleLeaveChange}
                  sx={{ color: colors.blueAccent[400] }}
                />
              }
              label="Nghỉ phép"
              sx={{ color: colors.blueAccent[400] }} 
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMorning}
                  onChange={handleMorningChange}
                  sx={{ color: colors.blueAccent[400] }} 
                />
              }
              label="Buổi Sáng"
              sx={{ color: colors.blueAccent[400] }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAfternoon}
                  onChange={handleAfternoonChange}
                  sx={{ color: colors.blueAccent[400] }}
                />
              }
              label="Buổi Chiều"
              sx={{ color: colors.blueAccent[400] }} 
            />
          </Box>
          {/* chọn ngày */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker"]}
              sx={{ width: "200px" }}
            >
              <DatePicker
                label="Chọn Ngày"
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ color: colors.blueAccent[400] }} 
              />
            </DemoContainer>
          </LocalizationProvider>
          {/* Dropdown list cho bác sĩ */}
          <FormControl sx={{ mb: 2, mt: 2, width: "200px" }}>
            <InputLabel
              sx={{ color: colors.blueAccent[400] }}
              id="doctor-label"
            >
              Chọn Bác Sĩ
            </InputLabel>
            <Select
              labelId="doctor-label"
              id="doctor-select"
              value={selectedDoctor}
              label="Chọn Bác Sĩ"
              onChange={handleDoctorChange}
            >
              {doctorDetails.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFormSubmit}
        >
          Xác nhận
        </Button>
      </Box>
    </Box>
  );
};

export default WorkAssign;

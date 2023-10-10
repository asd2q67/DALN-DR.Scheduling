import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import "./style.css";
import { fetchDataFromAPI } from "../../data/api";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedCell, setSelectedCell] = useState({
    row: null,
    column: null,
    value: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newEventContent, setNewEventContent] = useState("");

  // Hàm xử lý khi người dùng nhấp vào ô
  const handleCellClick = (row, column, value) => {
    setSelectedCell({ row, column, value });
    setOpenDialog(true); // Mở dialog khi bạn nhấp vào ô
  };
  const handleOpenDialog = (row, column, value) => {
    console.log("Opening dialog with data:", row, column, value);
    setSelectedCell({ row, column, value });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAddNewEvent = () => {
    // Xử lý logic khi người dùng thêm mới sự kiện ở đây
    // Ví dụ: gửi dữ liệu đến API hoặc cập nhật state
    console.log("New event content:", newEventContent);
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromAPI("/room_detail.php");
        setRoomData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm này sẽ trả về một mảng chứa 7 ngày từ ngày hiện tại
  const generateWeekDates = () => {
    const today = new Date();
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - today.getDay()); // Ngày đầu tiên của tuần (Chủ Nhật)
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + i);
      weekDates.push(day);
    }
    return weekDates;
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Doctor's Schedule" />

      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-cell">Room</TableCell>
                {generateWeekDates().map((day, index) => (
                  <TableCell key={index} className="table-cell">
                    {daysOfWeek[day.getDay()]}
                    <br />
                    {day.toLocaleDateString()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {roomData.map((room, roomIndex) => (
              <TableRow key={room.id}>
                <TableCell className="table-cell">{room.name}</TableCell>
                {generateWeekDates().map((day, dayIndex) => {
                  const formattedDate = day.toISOString().split("T")[0];
                  const matchingEvent = currentEvents.find(
                    (event) =>
                      event.room === room.name && event.start === formattedDate
                  );
                  return (
                    <TableCell
                      key={dayIndex}
                      className="table-cell"
                      onClick={() =>
                        handleCellClick(roomIndex, dayIndex, room.name)
                      }
                    >
                      {matchingEvent ? matchingEvent.title : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </Table>
        </TableContainer>
        {selectedCell.row !== null && (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              Chọn bác sĩ cho phòng "{selectedCell.value}" vào ngày{" "}
              {daysOfWeek[selectedCell.column]}.
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Nhập tên bác sĩ:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="event-content"
                label="Nội dung sự kiện"
                type="text"
                fullWidth
                value={newEventContent}
                onChange={(e) => setNewEventContent(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Hủy
              </Button>
              <Button onClick={handleAddNewEvent} color="primary">
                Thêm mới
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default Calendar;

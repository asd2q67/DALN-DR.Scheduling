import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Header from "../../components/Header";
import { fetchDataFromAPI } from "../../data/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

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
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const currentDate = new Date();

  // Hàm này sẽ trả về một mảng chứa 7 ngày từ ngày hiện tại
  const generateWeekDates = () => {
    const startDay = new Date(currentWeekStart);
    startDay.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Ngày đầu tiên của tuần (Chủ Nhật)
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + i);
      weekDates.push(day);
    }
    return weekDates;
  };
  
  const columns = [
    { field: "id", headerName: "Room", width: 150 },
    ...generateWeekDates().map((day, index) => ({
      field: `day${index}`,
      headerName: `${daysOfWeek[day.getDay()]} ${day.toLocaleDateString()}`,
      width: 150,
    })),
  ];

  const rows = roomData.map((room, roomIndex) => {
    const row = {
      id: room.name,
      ...generateWeekDates().reduce((acc, day, dayIndex) => {
        const formattedDate = day.toISOString().split("T")[0];
        const matchingEvent = currentEvents.find(
          (event) =>
            event.room === room.name && event.start === formattedDate
        );
        acc[`day${dayIndex}`] = matchingEvent ? matchingEvent.title : "";
        return acc;
      }, {}),
    };
    return row;
  });

  const handleCellClick = (params) => {
    setSelectedCell({
      row: params.row.id,
      column: params.field,
      value: params.value,
    });
    setOpenDialog(true);
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
    console.log("New event content:", newEventContent);
    handleCloseDialog();
  };
  const moveToPreviousWeek = () => {
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(previousWeekStart);
  };

  const moveToCurrentWeek = () => {
    setCurrentWeekStart(new Date());
  };

  const moveToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
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

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Doctor's Schedule" />

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginBottom="20px"
      >
        <Button
          onClick={moveToPreviousWeek}
          variant="contained"
          color="secondary"
        >
          &lt; Previous Week
        </Button>
        <Button
          onClick={moveToCurrentWeek}
          variant="contained"
          color="secondary"
        >
          Current Week
        </Button>
        <Button onClick={moveToNextWeek} variant="contained" color="secondary">
          Next Week &gt;
        </Button>
      </Box>

      <Box>
        <Box
          m="40px 0 0 0"
          height="65vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-cell--currentDate": {
              backgroundColor: `${colors.greenAccent[200]} !important`,
              color: `${colors.primary} !important`
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            onCellClick={handleCellClick}
          />
        </Box>

        {selectedCell.row !== null && (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              Chọn bác sĩ cho phòng "{selectedCell.value}" vào ngày{" "}
              {daysOfWeek[selectedCell.column]}.
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Nhập tên bác sĩ:</DialogContentText>
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

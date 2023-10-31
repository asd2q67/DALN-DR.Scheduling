import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import { fetchDataFromAPI } from "../../data/api";
import Header from "../../components/Header";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [calendarData, setCalendarData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drData, rmData] = await Promise.all([
          fetchDataFromAPI("/dr_detail.php"),
          fetchDataFromAPI("/room_detail.php"),
        ]);
        setDoctorData(drData);
        if (JSON.stringify(rmData) !== JSON.stringify(roomData)) {
          setRoomData(rmData);
        }
        // Kiểm tra xem có dữ liệu phòng hay không
        if (rmData.length > 0) {
          const response = await fetch("http://localhost:3001/api/data");
          const jsonData = await response.json();
          // Chuyển đổi dữ liệu từ API để phù hợp với DataGrid và ghép thông tin phòng vào lịch trình

          const roomMap = rmData.reduce((acc, room, index) => {
            const roomKey = (index + 1).toString();
            acc[roomKey] = room.name;
            return acc;
          }, {});

          const doctorMap = drData.reduce((acc, doctor, index) => {
            const Key = (index + 1).toString();
            acc[Key] = doctor.Name;
            return acc;
          }, {});

          const formattedData = jsonData.map((day, index) => {
            const Key = (index + 1).toString();
            const roomName = roomMap[Key] || "";

            for (let key in day) {
              if (key !== "day") {
                  try {
                      const parsedData = JSON.parse(day[key]);
                      const doctorNames = parsedData.map((key) => doctorMap[key]);
                      day[key] = doctorNames.join(",");
                  } catch (error) {
                      // Handle JSON parsing error
                      console.error("Error parsing JSON:", error);
                      // Provide a fallback value or handle the error accordingly
                      day[key] = "Error parsing data";
                  }
              }
          }         

            return {
              id: index.toString(), // Sử dụng index làm id, chúng ta cần đảm bảo id là duy nhất
              room: roomName, // Sử dụng tên phòng
              ...day,
            };
          });
          console.log(1000, formattedData);
          setCalendarData(formattedData);
          setLoading(false);
          // console.log("Data from API:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [roomData]); // Thêm roomData vào dependency array để useEffect chỉ chạy khi roomData thay đổi

  const dayOfWeekInVietnamese = {
    Monday: "Thứ 2",
    Tuesday: "Thứ 3",
    Wednesday: "Thứ 4",
    Thursday: "Thứ 5",
    Friday: "Thứ 6",
    Saturday: "Thứ 7",
    Sunday: "Chủ Nhật",
  };

  // Trong useEffect, thay đổi ngày thành tiếng Việt trước khi đưa vào columns:
  const columns = [
    { field: "room", headerName: "Phòng", width: 150 }, // Cột tên phòng
    ...Array.from({ length: 7 }, (_, index) => {
      const day = dayjs()
        .startOf("week")
        .add(index + 1, "day")
        .format("dddd");
      const dayInVietnamese = dayOfWeekInVietnamese[day];
      return {
        field: index.toString(),
        headerName: dayInVietnamese,
        width: 150,
      }; // Cột cho ngày trong tuần
    }),
  ];
  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Lịch làm việc trong tháng" />
      <Box
        m="40px 0 0 0"
        height="65vh"
        sx={{
          // styles here
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .skill-column--cell": {
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
        }}
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <DataGrid
            rows={calendarData}
            columns={columns}
            pageSize={10}
            pagination
          />
        )}
      </Box>
    </Box>
  );
};

export default Calendar;
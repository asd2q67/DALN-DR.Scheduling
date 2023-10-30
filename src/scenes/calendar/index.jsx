import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchDataFromAPI } from "../../data/api";

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const drData = await fetchDataFromAPI("/dr_detail.php");
        const rmData = await fetchDataFromAPI("/room_detail.php");
        setDoctorData(drData);
        setRoomData(rmData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/data");
        const jsonData = await response.json();
        console.log(111, roomData);
        // Chuyển đổi dữ liệu từ API để phù hợp với DataGrid và ghép thông tin phòng vào lịch trình
        const formattedData = jsonData.map((day, index) => {
          // Lấy thông tin phòng từ các key như 0, 1, 2,...
          const roomKey = index.toString();
          const roomInfo = roomData.find((room) => room.id === roomKey);
          const roomName = roomInfo ? roomInfo.name : ""; // Lấy tên phòng từ thông tin phòng

          return {
            id: index.toString(), // Sử dụng index làm id, chúng ta cần đảm bảo id là duy nhất
            room: roomName, // Sử dụng tên phòng
            ...day, // Các ngày trong tuần trở thành các cột
          };
        });
        console.log(1000);
        setCalendarData(formattedData);
        setLoading(false);
        console.log("Data from API:", jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "room", headerName: "Phòng", width: 150 }, // Cột tên phòng
    ...Array.from({ length: 7 }, (_, index) => {
      const day = dayjs()
        .startOf("week")
        .add(index + 1, "day")
        .format("dddd");
      return { field: index.toString(), headerName: day, width: 150 }; // Cột cho ngày trong tuần
    }),
  ];

  return (
    <Box m="20px">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <DataGrid
          rows={calendarData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
        />
      )}
    </Box>
  );
};

export default Calendar;

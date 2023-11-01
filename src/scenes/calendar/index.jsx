import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import { fetchDataFromAPI } from "../../data/api";
import Header from "../../components/Header";
import "./styles.css";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [calendarData, setCalendarData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shiftsPerDay = 2; // Morning and Afternoon shifts
  const daysPerWeek = 7;

  // Ngày bắt đầu (30/10/2023 là một ngày thứ Hai)
  const startDate = dayjs("2023-10-30");

  // Hàm để lấy tên của ngày dựa trên số ngày kể từ ngày bắt đầu
  const getDayName = (dayIndex) => {
    return startDate.add(dayIndex, "day").format("dddd");
  };

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
          console.log(121212, jsonData);
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
                  day[key] = doctorNames;
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
          // console.log(1000, formattedData);
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

  const dayColumns = Array.from({ length: daysPerWeek }, (_, dayIndex) => {
    const dayName = dayjs(startDate).add(dayIndex, "day").format("dddd"); // Use startDate to calculate dayName
    const dayColumn = {
      field: `day-${dayName}`, // Use dayName in the field name
      headerName: `${dayOfWeekInVietnamese[dayName]} (${startDate
        .add(dayIndex, "day")
        .format("DD/MM/YYYY")})`, // Use dayName and formatted date in the header
      width: 300, // Width of the day column
      children: [], // Sub-columns for Morning and Afternoon
    };

    // Add Morning and Afternoon sub-columns
    for (let shiftIndex = 0; shiftIndex < shiftsPerDay; shiftIndex++) {
      const shiftName = shiftIndex === 0 ? "Sáng" : "Chiều";
      dayColumn.children.push({
        field: `day-${dayName}-${shiftName}`, // Use dayName in the field name
        headerName: shiftName,
        width: 150, // Width of each sub-column
        shift: dayIndex * shiftsPerDay + shiftIndex,
      });
    }

    return dayColumn;
  });

  const columns = [
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 100,
      onHeaderCell: () => ({
        //phòng
        style: {
          backgroundColor: colors.blueAccent[600],
          color: colors.greenAccent[300],
        },
      }),
      render: (room) => (
        <div
          style={{
            color: colors.greenAccent[300], fontWeight: "bold"
          }}
        >
          {room}
        </div>
      ),
    }, // Cột tên phòng
    ...dayColumns.map((dayColumn) => ({
      title: dayColumn.headerName,
      headerClassName: "custom-header",
      children: dayColumn.children.map((shiftCol) => ({
        title: shiftCol.headerName,
        dataIndex: shiftCol.shift,
        key: shiftCol.field,
        width: 100,
        render: (doctors) => (
          <div>
            {doctors &&
              doctors.map((doctor, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: colors.greenAccent[500],
                    marginBottom: "5px",
                    padding: "5px",
                    borderRadius: "8px",
                  }}
                >
                  {doctor}
                </div>
              ))}
          </div>
        ),
        onHeaderCell: () => ({
          //header sáng chiều
          style: { backgroundColor: colors.grey[600], color: "yellow" },
        }),
      })),
      onHeaderCell: () => ({
        //Header ngày trong tuần
        style: {
          color: colors.greenAccent[300],
          backgroundColor: colors.blueAccent[600],
        },
      }),
    })),
  ];

  return (
    <div style={{ margin: "20px" }}>
      {console.log(1111, columns)}
      {/* {console.log(2222, calendarData)} */}
      <Header title="CALENDAR" subtitle="Lịch làm việc trong tháng" />
      <div style={{ margin: "40px 0 0 0", overflowX: "auto" }}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <Table
            columns={columns}
            dataSource={calendarData}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;

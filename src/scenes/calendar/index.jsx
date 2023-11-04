import React, { useEffect, useState } from "react";
import { Button, Select, Table, Tag } from "antd";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import { fetchDataFromAPI } from "../../data/api";
import Header from "../../components/Header";
import "./styles.css";
import { Box, Button as Btn, useTheme } from "@mui/material";
import { Modal } from "antd";
import { EditOutlined } from "@mui/icons-material";
import { CSVLink } from "react-csv";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [calendarData, setCalendarData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [selectedCell, setSelectedCell] = useState(1);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(undefined);
  // const { exec } = require("child_process");

  const shiftsPerDay = 2; // Morning and Afternoon shifts
  const daysPerWeek = 7;

  // Ngày bắt đầu (30/10/2023 là một ngày thứ Hai)
  const startDate = dayjs("2023-10-30");

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
          // console.log(1000, response);
          // console.log(2000, jsonData);
          // Chuyển đổi dữ liệu từ API để phù hợp với DataGrid và ghép thông tin phòng vào lịch trình

          const roomMap = rmData.reduce((acc, room, index) => {
            const roomKey = (index + 1).toString();
            acc[roomKey] = room.name;
            return acc;
          }, {});

          const doctorMap = drData.reduce((acc, doctor, index) => {
            const Key = index.toString();
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
                  // console.log(123, day[key]);

                  // Check if parsedData is an array before mapping over it
                  if (Array.isArray(parsedData)) {
                    const doctorNames = parsedData.map((key) => doctorMap[key]);
                    day[key] = doctorNames;
                  } else {
                    // If parsedData is not an array, handle it accordingly (fallback value or error handling)
                    day[key] = "Invalid data format"; // Provide a fallback value or handle the error accordingly
                  }
                } catch (error) {
                  // Handle JSON parsing error
                  console.error("Error parsing JSON:", error);
                  // Provide a fallback value or handle the error accordingly
                  day[key] = "Error parsing data";
                }
              }
            }

            return {
              id: index.toString(),
              room: roomName,
              ...day,
            };
          });

          // console.log(1234, formattedData);
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
            color: colors.greenAccent[300],
            fontWeight: "bold",
          }}
        >
          {room}
        </div>
      ),
    }, // Cột tên phòng
    ...dayColumns.map((dayColumn) => ({
      title: dayColumn.headerName,
      children: dayColumn.children.map((shiftCol) => ({
        title: shiftCol.headerName,
        dataIndex: shiftCol.shift,
        key: shiftCol.field,
        width: 100,
        render: (doctors) => (
          <div
            id={`${shiftCol.shift}`}
            style={{ display: "flex", width: "100%", alignItems: "center" }}
          >
            <div>
              {doctors &&
                doctors.map((doctor, index) => (
                  <Tag
                    key={index}
                    style={{
                      backgroundColor: colors.greenAccent[500],
                      marginBottom: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {doctor}
                  </Tag>
                ))}
            </div>
            <EditOutlined
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                fontSize: "18px",
                color: "#1890ff",
              }}
              onClick={(event) => handleEditClick(event, shiftCol.shift)}
            />
          </div>
        ),
        onCell: (record, index) => {
          return {
            onClick: () => {
              setSelectedCell(record);
              setRoomId(index);
            },
          };
        },
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

  const handleEditClick = (event, divId) => {
    setDoctorId(divId);
    setIsClick(Math.random());
  };

  const convertData = (data) => {
    const doctorMap = doctorData.reduce((acc, doctor, index) => {
      const Key = index.toString();
      acc[Key] = doctor.Name;
      return acc;
    }, {});
    const convertedData = data.map((item) => {
      const convertedItem = [];
      for (let i = 0; i <= 13; i++) {
        const doctors = item[i] || [];
        const doctorIds = doctors
          .map((doctor) => {
            const doctorId = Object.keys(doctorMap).find(
              (key) => doctorMap[key] === doctor
            );
            return doctorId !== undefined ? doctorId : doctor;
          })
          .join(", ");
        convertedItem.push(`"[${doctorIds}]"`);
      }
      // console.log(1212, convertedItem);
      return convertedItem.join(",");
    });
    // console.log(222, convertedData);
    let headerRow = "";
    for (let i = 0; i <= 13; i++) {
      headerRow += `${i},`;
    }
    headerRow = headerRow.slice(0, -1);
    const finalData = [headerRow, ...convertedData];
    return finalData.join("\n");
  };

  const saveToServer = async (csvData) => {
    try {
      const response = await fetch("http://localhost:3001/save-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: csvData }),
      });
      const result = await response.text();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = () => {
    if (selectedDoctor && selectedCell !== null && roomId !== null) {
      const updatedCalendarData = [...calendarData];
      const currentDoctors = updatedCalendarData[roomId][doctorId];

      if (currentDoctors && Array.isArray(currentDoctors)) {
        // Check if the selected doctor is not already in the shift
        if (!currentDoctors.includes(selectedDoctor)) {
          // Update the selected shift with the new doctor
          updatedCalendarData[roomId][doctorId] = [
            ...currentDoctors,
            selectedDoctor,
          ];
          setCalendarData(updatedCalendarData);
        }
      } else {
        // If there are no doctors in the shift, add the selected doctor
        updatedCalendarData[roomId][doctorId] = [selectedDoctor];
        setCalendarData(updatedCalendarData);
      }

      // Close the modal after submitting the form
      setIsModalVisible(false);
      setSelectedDoctor(null);

      const csvData = convertData(calendarData);
      // console.log(1231231, csvData);
      saveToServer(csvData);
    }
  };

  useEffect(() => {
    if (selectedCell) {
      // Thực hiện hành động khi selectedCell thay đổi, ví dụ: hiển thị modal
      setSelectedDoctorInfo(selectedCell[doctorId]);
      if (doctorId !== null) setIsModalVisible(true);
    }
  }, [selectedCell, doctorId, isClick]);

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
  };

  const handleTagDoubleClick = (event, doctorName) => {
    // Xác định index của bác sĩ trong mảng selectedDoctorInfo
    const doctorIndex = selectedDoctorInfo.findIndex(
      (doctor) => doctor === doctorName
    );

    // Kiểm tra xem bác sĩ có tồn tại trong mảng hay không
    if (doctorIndex !== -1) {
      // Xóa bác sĩ khỏi mảng selectedDoctorInfo
      const updatedDoctorInfo = [...selectedDoctorInfo];
      updatedDoctorInfo.splice(doctorIndex, 1);
      setSelectedDoctorInfo(updatedDoctorInfo);

      // Cập nhật dữ liệu lên máy chủ
      const updatedCalendarData = [...calendarData];
      updatedCalendarData[roomId][doctorId] = updatedDoctorInfo;
      setCalendarData(updatedCalendarData);

      // Chuyển đổi và lưu dữ liệu CSV lên máy chủ
      const csvData = convertData(updatedCalendarData);
      saveToServer(csvData);
    }
  };

  const exportCsvData = () => {
    const csvRows = [];

    // Tạo dòng tiêu đề
    let headerRow = "";
    for (let i = 0; i <= doctorData.length * 2; i++) {
      const shiftType = i % 2 === 0 ? "Chiều" : "Sáng";
      const dayIndex = Math.ceil(i / 2);
      headerRow += `${shiftType} thứ ${dayIndex},`;
    }
    headerRow = headerRow.slice(0, -1);
    csvRows.push(headerRow);

    // Tạo các dòng dữ liệu
    calendarData.forEach((roomCalendar) => {
      let csvRow = [];
      for (let i = 0; i <= 13; i++) {
        const shiftData = roomCalendar[i] ? roomCalendar[i].join(", ") : "";
        console.log(1212, roomCalendar);
        csvRow += `[${shiftData}],`;
      }
      csvRow = csvRow.slice(0, -1);
      console.log(111);
      csvRows.push(csvRow);
    });

    // Ghi file CSV
    const csvContent = csvRows.join("\n");
    // console.log(12122, csvContent);
    return csvContent;
  };

  const handleInitCalendar = () => {

  };

  return (
    <div style={{ margin: "20px" }}>
      {/* {console.log(2222, calendarData)} */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="CALENDAR" subtitle="Lịch làm việc trong tháng" />
        <Box>
          <Btn
            style={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginRight: "10px",
            }}
            onClick={handleInitCalendar()}
          >
            Khởi tạo lịch
          </Btn>
          <CSVLink data={exportCsvData()} filename={"calendar.csv"}>
            <Btn
              style={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Tải xuống lịch
            </Btn>
          </CSVLink>
        </Box>
      </Box>

      <Modal
        title="Chỉnh sửa lịch làm việc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div style={{ display: "flex" }}>
          {selectedDoctorInfo &&
            selectedDoctorInfo.map((doctor, index) => (
              <Tag
                key={index}
                style={{
                  backgroundColor: colors.greenAccent[500],
                  marginBottom: "5px",
                  borderRadius: "5px",
                }}
                onDoubleClick={(event) => handleTagDoubleClick(event, doctor)}
              >
                {doctor}
              </Tag>
            ))}
        </div>
        <p>Thêm bác sĩ mới:</p>
        {/* Dropdown list cho bác sĩ */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Select
            style={{ width: 200, marginBottom: 16 }}
            placeholder="Chọn Bác Sĩ"
            value={selectedDoctor}
            onChange={handleDoctorChange}
          >
            {doctorData.map((doctor) => (
              <Select.Option key={doctor.id} value={doctor.Name}>
                {doctor.Name}
              </Select.Option>
            ))}
          </Select>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFormSubmit}
            style={{ background: colors.greenAccent[500] }}
          >
            Xác nhận
          </Button>
        </div>
      </Modal>

      <div style={{ margin: "20px 0 0 0", overflowX: "auto", width: "auto" }}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <Table
            columns={columns}
            dataSource={calendarData}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content", y: window.innerHeight - 350 }}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;

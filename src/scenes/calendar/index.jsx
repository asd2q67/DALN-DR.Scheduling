import React, { useEffect, useState } from "react";
import { Button, Select, Table, Tag, Tooltip } from "antd";
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
  const [assignDoctors, setAssignDoctors] = useState({});

  // const { exec } = require("child_process");

  const shiftsPerDay = 2; // Morning and Afternoon shifts
  const daysPerWeek = 7;

  // Ngày bắt đầu (30/10/2023 là một ngày thứ Hai)
  const startDate = dayjs("2023-10-30");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drData, rmData, drAssign] = await Promise.all([
          fetchDataFromAPI("/dr_detail.php"),
          fetchDataFromAPI("/room_detail.php"),
          fetchDataFromAPI("/work_detail.php"),
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

          // console.log(doctorMap, drAssign, roomMap);

          const assignMap = drAssign
            .filter((assgin) => {
              return assgin.room == -1;
            })
            .reduce((acc, assign, index) => {
              const Key = index.toString();
              const data = {
                roomName: "Nghỉ phép",
                doctorName: doctorMap[parseInt(assign.doctor_id) - 1],
                shift: assign.session,
              };
              acc[Key] = data;
              return acc;
            }, {});

          setAssignDoctors(assignMap);

          console.log(6666, assignMap);

          const formattedData = jsonData.map((day, index) => {
            const Key = (index + 1).toString();
            const roomName = roomMap[Key] || "";
            // console.log(666, drData);
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

  const getTagBackgroundColor = (skill) => {
    if (skill === "1") {
      return "yellow";
    } else if (skill === "2") {
      return colors.greenAccent[500];
    }
    return colors.redAccent[500]; // default color for skill 0
  };

  const getColor = (skill) => {
    switch (skill) {
      case "1":
        return "black"; // Background color for skill level 1
      case "2":
        return "black"; // Background color for skill level 2
      default:
        return "white"; // Background color for skill level 0
    }
  };

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
      render: (room, roomId) => (
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
    // {
    //   title: "Absent Doctors",
    //   dataIndex: "absentDoctors",
    //   key: "absentDoctors",
    //   width: 100,
    //   render: (absentDoctors) => (
    //     <div style={{ display: "flex", flexDirection: "column" }}>
    //       {absentDoctors.map((doctor, index) => (
    //         <div key={index} style={{ marginBottom: "5px" }}>
    //           {doctor}
    //         </div>
    //       ))}
    //     </div>
    //   ),
    //   fixed: "right", // Stick the column to the right side
    // },
    ...dayColumns.map((dayColumn) => ({
      title: dayColumn.headerName,
      children: dayColumn.children.map((shiftCol) => ({
        title: shiftCol.headerName,
        dataIndex: shiftCol.shift,
        key: shiftCol.field,
        width: 100,
        render: (doctors, record) => {
          // console.log(8888, record);
          return (
            <div
              id={`${shiftCol.shift}`}
              style={{ display: "flex", width: "100%", alignItems: "center" }}
            >
              {/* use doctorData.find((doctorInfo) => {if(doctorInfo.Name === doctor) skill = doctorInfo.`R${record.id}`}) */}
              {/* if(skill === 0) //turn Tag background to red, skill === 1 turn to yellow and skill === 2 turn to green */}
              <div>
                {doctors &&
                  doctors.map((doctor, index) => {
                    const doctorInfo = doctorData.find(
                      (info) => info.Name === doctor
                    );
                    // console.log(parseInt(record.id)+1, doctorInfo);
                    const skill = doctorInfo
                      ? doctorInfo[`R${parseInt(record.id) + 1}`]
                      : null;
                      let backgroundColor = getTagBackgroundColor(skill);
                      let color = getColor(skill);
        
                      Object.values(assignDoctors).map((assignment) => {
                        if (assignment.doctorName === doctor && parseInt(assignment.shift) - 1 == shiftCol.shift) {
                          backgroundColor = colors.grey[500];
                          color = "white";
                        }
                      }); // default color for skill 0

                    return (
                      <Tag
                        key={index}
                        style={{
                          backgroundColor: backgroundColor,
                          color: color,
                          marginBottom: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {doctor}
                      </Tag>
                    );
                  })}
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
          );
        },
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
  const save2Server = async (csvContent) => {
    try {
      const response = await fetch("http://localhost:3001/export-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: csvContent }),
      });

      const result = await response.text();
      console.log(result); // Hiển thị thông điệp từ máy chủ
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu tới máy chủ:", error);
    }
  };
  const savePersonalCSV = async (csvContent) => {
    try {
      const response = await fetch("http://localhost:3001/personal-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: csvContent }),
      });

      const result = await response.text();
      console.log(result); // Hiển thị thông điệp từ máy chủ
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu tới máy chủ:", error);
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
  }, [selectedCell, doctorId, isClick, roomId]);

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
    let headerRow = "\ufeffPhòng,";
    for (let i = 3; i <= doctorData.length + 2; i++) {
      const shiftType = i % 2 === 0 ? "Chiều" : "Sáng"; // Sáng thứ 2 đến chiều Chủ nhật
      const day = Math.ceil(i / 2);
      const dayIndex = day === 8 ? "Chủ nhật" : `thứ ${day}`;
      headerRow += `${shiftType} ${dayIndex},`;
    }
    headerRow = headerRow.slice(0, -1);

    csvRows.push(headerRow);

    // Tạo các dòng dữ liệu
    calendarData.forEach((roomCalendar) => {
      console.log(1111, roomCalendar);
      let csvRow = "";
      csvRow += `${roomCalendar.room},`;
      for (let i = 0; i <= 13; i++) {
        csvRow += `"${roomCalendar[i].join("\n")}"`;
        if (i < 13) {
          csvRow += ",";
        }
      }
      csvRows.push(csvRow);
    });

    // Ghi file CSV
    const csvContent = csvRows.join("\n");
    // console.log(5555, csvContent);
    save2Server(csvContent);
  };
  const dataGen = () => {
    const roomMap = roomData.reduce((acc, room, index) => {
      const data = { id: index, Name: room.name };
      acc[index] = data;
      return acc;
    }, {});

    const doctorMap = doctorData.reduce((acc, doctor, index) => {
      const key = doctor.id - 1;
      const data = {
        id: key,
        Name: doctor.Name,
        Room: Object.values(roomMap).map((room) => ({ ...room })),
      };
      acc[key] = data;
      return acc;
    }, {});

    const doctorSchedules = [];

    Object.values(doctorMap)
      .sort((a, b) => a.id - b.id) // Sắp xếp theo doctorProfile.id
      .forEach((doctorProfile) => {
        const schedule = {};
        calendarData.forEach((roomCalendar, roomId) => {
          const workingDays = [];
          Object.values(roomCalendar).forEach((day, dayIndex) => {
            if (Array.isArray(day)) {
              day.forEach((workDoctor) => {
                if (workDoctor === doctorProfile.Name) {
                  workingDays.push(dayIndex);
                }
              });
            }
          });
          schedule[roomId] = workingDays;
        });
        doctorSchedules.push({
          id: doctorProfile.id,
          Name: doctorProfile.Name,
          Schedule: schedule,
        });
      });

    // Giờ bạn có doctorSchedules đã được sắp xếp theo doctorProfile.id
    // console.log(11551, doctorSchedules);
    return doctorSchedules;
  };
  const personalCSV = () => {
    const doctorSchedules = dataGen();
    const csvRows = [];

    const roomMap = roomData.reduce((acc, room, index) => {
      const data = { id: index, Name: room.name };
      acc[index] = data;
      return acc;
    }, {});

    const doctorMap = doctorData.reduce((acc, doctor, index) => {
      const key = doctor.id - 1;
      const data = {
        id: key,
        Name: doctor.Name,
        Room: Object.values(roomMap).map((room) => ({ ...room })),
      };
      acc[key] = data;
      return acc;
    }, {});

    // Tạo dòng tiêu đề
    let headerRow = "\ufeffBác sĩ,";
    for (let i = 3; i <= doctorData.length + 2; i++) {
      const shiftType = i % 2 === 0 ? "Chiều" : "Sáng"; // Sáng thứ 2 đến chiều Chủ nhật
      const day = Math.ceil(i / 2);
      const dayIndex = day === 8 ? "Chủ nhật" : `thứ ${day}`;
      headerRow += `${shiftType} ${dayIndex},`;
    }
    headerRow = headerRow.slice(0, -1);

    csvRows.push(headerRow);
    // Tạo các dòng dữ liệu
    Object.keys(doctorSchedules).forEach((doctorName) => {
      const schedule = doctorSchedules[doctorName].Schedule;
      const csvRow = [doctorSchedules[doctorName].Name];
      for (let roomId = 0; roomId <= roomData.length - 1; roomId++) {
        //14 ngay
        //Check xem đã qua phòng mới hay chưa? Nếu đã qua roomId mới tiến hành cộng chuỗi từ đầu
        let isNewRoom = false;
        if (schedule[roomId].length !== 0) {
          let tempSchedule = [...schedule[roomId]];
          for (let dayId = 0; dayId < 14; dayId++) {
            //dayId 0-13 là ngày, roomId 0-9 là phòng, workDayNum là số ngày làm của bác sĩ
            // console.log(dayId, tempSchedule);
            let isSet = false;
            for (
              let workDayNum = 0;
              workDayNum < tempSchedule.length;
              workDayNum++
            ) {
              // console.log(dayId, csvRow);
              if (tempSchedule[workDayNum] === dayId) {
                csvRow.push(`"${roomMap[roomId].Name}"`);
                isSet = true;
                tempSchedule = tempSchedule.filter((item) => item !== dayId);
                break;
              }
            }
            if (!isSet && tempSchedule.length !== 0) csvRow.push(`""`);
          }
        }

        // console.log(666, csvRow);
        isNewRoom = true;
      }
      csvRows.push(csvRow.join(","));
      console.log(444, schedule);
    });
    console.log(333, csvRows);
    const csvContent = csvRows.join("\n");
    savePersonalCSV(csvContent);
  };

  const handleInitCalendar = () => {
    fetch("http://localhost:5000/init-calendar", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Hiển thị dữ liệu trả về từ API
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getDoctorStatus = (schedule, roomId) => {
    const roomList = [];

    Object.keys(schedule).forEach((roomIndex) => {
      if (schedule[roomIndex].includes(roomId)) {
        roomList.push(roomData[roomIndex].name);
      }
    });

    return roomList.length > 0 ? roomList : "Available";
  };
  //dropDownBar component
  const DoctorDropdown = () => {
    const doctorSchedules = dataGen();
    //Tạo Status của bác sĩ
    const schedules = doctorSchedules.map((doctorSchedule) => {
      return doctorSchedule.Schedule;
    });
    const allStatus = [];
    for (let i = 0; i < doctorData.length; i++) {
      const doctorStatus = getDoctorStatus(schedules[i], roomId);
      allStatus.push(doctorStatus);
    }
    // console.log(doctorSchedules);
    return (
      <div>
        <div>
          <Select
            style={{ width: 200, marginBottom: 16, width: "100%" }}
            placeholder="Chọn Bác Sĩ"
            onChange={handleDoctorChange}
            value={selectedDoctor}
          >
            {doctorData.map((doctor) => {
              //Tạo background của từng các sĩ ứng với kinh nghiệm của họ tại phòng đó.
              const doctorInfo = doctorData.find(
                (info) => info.Name === doctor.Name
              );
              const skill = doctorInfo
                ? doctorInfo[`R${parseInt(roomId) + 1}`]
                : null;
              const backgroundColor = getTagBackgroundColor(skill);
              const color = getColor(skill);
              const statusText = Array.isArray(allStatus[doctor.id])
                ? `Đang làm tại: ${allStatus[doctor.id].join(", ")}`
                : "Chưa chia lịch";
              return (
                <Select.Option
                  key={doctor.id}
                  value={doctor.Name}
                  style={{ backgroundColor: backgroundColor, color: color }}
                >
                  <Tooltip
                    title={statusText}
                  >{`${doctor.Name} - ${statusText}`}</Tooltip>
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFormSubmit}
          style={{ background: colors.greenAccent[500] }}
        >
          Thêm bác sĩ
        </Button>
      </div>
    );
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
            onClick={handleInitCalendar}
          >
            Khởi tạo lịch
          </Btn>
          <Btn
            style={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginRight: "10px",
            }}
            onClick={exportCsvData}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Tải xuống lịch theo phòng
          </Btn>
          <Btn
            style={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={personalCSV}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Tải xuống lịch bác sĩ
          </Btn>
        </Box>
      </Box>

      <Modal
        title="SỬA LỊCH LÀM VIỆC"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <b>Các bác sĩ xin nghỉ phép:</b>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {assignDoctors &&
            Object.values(assignDoctors).map((assignment) => {
              // console.log(assignment);
              if (parseInt(assignment.shift) - 1 == doctorId) {
                return (
                  <Tag
                    style={{
                      backgroundColor: colors.grey[500],
                      color: "white",
                      marginBottom: "5px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {assignment.doctorName}
                  </Tag>
                );
              }
            })}
        </div>
        <b>Các bác sĩ làm việc tại phòng:</b>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {selectedDoctorInfo &&
            selectedDoctorInfo.map((doctor, index) => {
              const doctorInfo = doctorData.find(
                (info) => info.Name === doctor
              );
              const skill = doctorInfo
                ? doctorInfo[`R${parseInt(roomId) + 1}`]
                : null;

              let backgroundColor = getTagBackgroundColor(skill);
              let color = getColor(skill);

              Object.values(assignDoctors).map((assignment) => {
                if (assignment.doctorName === doctor && parseInt(assignment.shift) - 1 == doctorId) {
                  backgroundColor = colors.grey[500];
                  color = "white";
                }
              });

              return (
                <Tag
                  key={index}
                  style={{
                    backgroundColor: backgroundColor,
                    color: color,
                    marginBottom: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onDoubleClick={(event) => handleTagDoubleClick(event, doctor)}
                >
                  {doctor}
                </Tag>
              );
            })}
        </div>
        <b>Thêm bác sĩ mới:</b>
        {/* Dropdown list cho bác sĩ */}
        <DoctorDropdown />
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

import React, { useEffect, useState } from "react";
import { Button, Select, Table, Tag, Tooltip, notification } from "antd";
import { tokens } from "../../theme";
import dayjs from "dayjs";
import { fetchDataFromAPI, fetchServerAPI } from "../../data/api";
import Header from "../../components/Header";
import "./styles.css";
import { Box, Button as Btn, useTheme } from "@mui/material";
import { Modal } from "antd";
import { EditOutlined } from "@mui/icons-material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const Calendar = ({ isCollapsed, updateCheck, setUpdateCheck }) => {
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
  const [initialState, setInitialState] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState([]);

  // const { exec } = require("child_process");

  const shiftsPerDay = 2; // Morning and Afternoon shifts
  const daysPerWeek = 7;

  // Ngày bắt đầu (30/10/2023 là một ngày thứ Hai)
  const startDate = dayjs("2023-11-6");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drData, rmData, drAssign, res] = await Promise.all([
          fetchDataFromAPI("/dr_detail.php"),
          fetchDataFromAPI("/room_detail.php"),
          fetchDataFromAPI("/work_detail.php"),
          fetchServerAPI("/api/doctor-schedules")
        ]);
        setDoctorData(drData);
        setDoctorSchedule(res);
        if (JSON.stringify(rmData) !== JSON.stringify(roomData)) {
          setRoomData(rmData);
        }
        // Kiểm tra xem có dữ liệu phòng hay không
        if (rmData.length > 0) {
          const response = await fetchServerAPI("/api/data");
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
            .filter((assign) => {
              return assign.room == -1;
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

          // console.log(6666, assignMap);

          const formattedData = response.map((day, index) => {
            const Key = (index + 1).toString();
            const roomName = roomMap[Key] || "";
            // console.log(666, drData);
            // Create a deep copy of the day object
            const preservedData = { ...day };
            for (let key in day) {
              if (key !== "day") {
                try {
                  const parsedData = JSON.parse(day[key]);
                  // console.log(123, day[key]);

                  // Check if parsedData is an array before mapping over it
                  if (Array.isArray(parsedData)) {
                    const doctorNames = parsedData.map((key) => doctorMap[key]);
                    preservedData[key] = doctorNames;
                  } else {
                    // If parsedData is not an array, handle it accordingly (fallback value or error handling)
                    preservedData[key] = "Invalid data format"; // Provide a fallback value or handle the error accordingly
                  }
                } catch (error) {
                  // Handle JSON parsing error
                  console.error("Error parsing JSON:", error);
                  // Provide a fallback value or handle the error accordingly
                  preservedData[key] = "Error parsing data";
                }
              }
            }

            return {
              id: index.toString(),
              room: roomName,
              ...preservedData,
            };
          });
          setCalendarData(formattedData);
          if (initialState.length === 0) {
            setInitialState(JSON.parse(JSON.stringify(formattedData)));
          }
          // console.log(1111, calendarData);
          // console.log(1234, initialState);

          setLoading(false);
          // console.log("Data from API:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [roomData]); // Thêm roomData vào dependency array để useEffect chỉ chạy khi roomData thay đổi

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await Promise.all([fetchServerAPI("/api/noti")]);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [updateCheck]);

  // const dayOfWeekInVietnamese = {
  //   Monday: "Thứ 2",
  //   Tuesday: "Thứ 3",
  //   Wednesday: "Thứ 4",
  //   Thursday: "Thứ 5",
  //   Friday: "Thứ 6",
  //   Saturday: "Thứ 7",
  //   Sunday: "Chủ Nhật",
  // };

  const dayColumns = Array.from({ length: daysPerWeek }, (_, dayIndex) => {
    const dayName = dayjs(startDate).add(dayIndex, "day").format("dddd"); // Use startDate to calculate dayName
    // console.log(777, dayName);
    const dayColumn = {
      field: `day-${dayName}`, // Use dayName in the field name
      headerName: `${dayName} (${startDate
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
      fixed: "left",
      onHeaderCell: () => ({
        //phòng
        style: {
          backgroundColor: "#753AD5",
          color: colors.primary[500],
        },
      }),
      render: (room) => (
        <div
          style={{
            height: "100%",
            width: "100%",
            padding: 0,
            color: colors.primary[500],
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
        render: (doctors, record) => {
          // console.log(8888, shiftCol);
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
                      if (
                        assignment.doctorName === doctor &&
                        parseInt(assignment.shift) == shiftCol.shift
                      ) {
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
          style: { backgroundColor: "#3CEE80", color: "#000000" },
        }),
      })),
      onHeaderCell: () => ({
        //Header ngày trong tuần
        style: {
          color: "#000000",
          backgroundColor: "#00C8FF",
        },
      }),
    })),
  ];

  const handleEditClick = (event, divId) => {
    setDoctorId(divId);
    setIsClick(Math.random());
  };

  const convertData = (data) => {
    // console.log(666, typeof data, data);
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
    // console.log(999, headerRow);
    // console.log(777, finalData.join("\n"));
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

  const handleRunChecker = async () => {
    const response = await fetch("http://localhost:5000/calendar-checker", {
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
    setTimeout(() => {
      setUpdateCheck(true);
    }, 1500);
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
      saveToServer(csvData);
      // console.log(999, initialState);
      handleRunChecker();
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
    for (let i = 3; i <= 16; i++) {
      const shiftType = i % 2 === 0 ? "Chiều" : "Sáng"; // Sáng thứ 2 đến chiều Chủ nhật
      const day = Math.ceil(i / 2);
      const dayIndex = day === 8 ? "Chủ nhật" : `thứ ${day}`;
      headerRow += `${shiftType} ${dayIndex},`;
    }
    headerRow = headerRow.slice(0, -1);
    console.log(1111, headerRow);

    csvRows.push(headerRow);

    // Tạo các dòng dữ liệu
    calendarData.forEach((roomCalendar) => {
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
  const personalCSV = async () => {
    // const doctorSchedules = dataGen();
    try {
      const res = await Promise.all([fetchServerAPI("/api/doctor-schedules")]);
      console.log(777, res);
      setDoctorSchedule(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setLoading(false);
    }

    const csvRows = [];
    // console.log(666, doctorSchedules);
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
    for (let i = 3; i < 17; i++) {
      const shiftType = i % 2 === 0 ? "Chiều" : "Sáng"; // Sáng thứ 2 đến chiều Chủ nhật
      const day = Math.ceil(i / 2);
      const dayIndex = day === 8 ? "Chủ nhật" : `thứ ${day}`;
      headerRow += `${shiftType} ${dayIndex},`;
    }
    headerRow = headerRow.slice(0, -1);

    csvRows.push(headerRow);
    console.log(111, doctorMap);
    doctorSchedule.map((list, index) => {
      console.log(doctorSchedule, list);
      let csvRow =  "";
      const doctorName = doctorMap[index].Name;
      csvRow += `${doctorName},`;
      const dataArray = Object.values(list).map(item => {
        // Sử dụng JSON.parse() để chuyển chuỗi JSON thành mảng
        const parsedArray = JSON.parse(item);
        // Nếu parsedArray là mảng, trả về mảng, ngược lại trả về mảng có một phần tử với giá trị parsedArray
        return Array.isArray(parsedArray) ? parsedArray : [parsedArray];
      });
      for (let i = 0; i < dataArray.length; i++) {
        const currentArray = dataArray[i];
        let tempArray = [];
        for (let j = 0; j < currentArray.length; j++) {
          const currentValue = currentArray[j];
          console.log(777, doctorMap[i].Room[currentValue].Name);
          tempArray.push(doctorMap[i].Room[currentValue].Name);
        }
        csvRow += tempArray.join(",") + ",";
      }
      csvRows.push(csvRow + "\n");
    });
    console.log(444, csvRows);
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
    handleRunChecker();
    setTimeout(() => {
      setUpdateCheck(true);
    }, 1500);
    window.location.reload();
  };

  useEffect(() => {
    // console.log(1000, isCollapsed);
  }, [initialState, isCollapsed]);

  const cancelChanges = () => {
    // console.log(5555, initialState);
    const csvData = convertData(initialState);
    console.log(666, csvData);
    saveToServer(csvData);
    handleRunChecker();
    window.location.reload();
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
              const isUnassigned = statusText === "Chưa chia lịch";
              return (
                <Select.Option
                  key={doctor.id}
                  value={doctor.Name}
                  style={{ backgroundColor: backgroundColor, color: color }}
                >
                  <Tooltip title={statusText}>
                    <span
                      className={isUnassigned ? "unassigned" : ""}
                    >{`${doctor.Name} - ${statusText}`}</span>
                  </Tooltip>
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
      {/* <div className={`custom-alert ${updateCheck ? "" : "hide-alert"}`}>
        {notifications[0]}
      </div> */}
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
            onClick={cancelChanges}
          >
            Hủy các thay đổi
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
              if (parseInt(assignment.shift) == doctorId) {
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
                if (
                  assignment.doctorName === doctor &&
                  parseInt(assignment.shift) == doctorId
                ) {
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
        {loading && (
          <div className="container" style={{ display: "flex" }}>
            <div className="loading-spinner"></div>
          </div>
        )}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <Table
            columns={columns}
            dataSource={calendarData}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content", y: window.innerHeight - 350 }}
            style={{ maxWidth: isCollapsed ? "93vw" : "80vw" }}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;

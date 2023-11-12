import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";
import { Box, IconButton, useTheme } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { tokens } from "../theme";
import { postDataToServer } from "../data/api";

const NotificationComponent = ({
  notifications,
  roomData,
  doctorData,
  setNotifications,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const workday = [
    "sáng thứ hai",
    "chiều thứ hai",
    "sáng thứ ba",
    "chiều thứ ba",
    "sáng thứ tư",
    "chiều thứ tư",
    "sáng thứ năm",
    "chiều thứ năm",
    "sáng thứ sáu",
    "chiều thứ sáu",
    "sáng thứ bảy",
    "chiều thứ bảy",
    "sáng chủ nhật",
    "chiều chủ nhật",
  ];
  const [oldNotifications, setOldNotifications] = useState([]);

  function findDifferentStrings(notifications, oldNotifications) {
    // Find differences between new and old notifications
    const differentStrings = notifications.filter(
      (notification) => !oldNotifications.includes(notification)
    );
    // console.log(999, differentStrings);

    // Join the different strings into a single string
    // const differentString = differentStrings.join(", ");

    return differentStrings;
  }

  useEffect(() => {
    const differentStrings = findDifferentStrings(
      notifications,
      oldNotifications
    );
    differentStrings.map((string) => {
      if ((string !== null, string.length > 0)) {
        showNote(string);
        // console.log(222, string);
      }
    });
    // console.log(111, (notifications[0]));
    setOldNotifications(notifications);
  }, [notifications]);

  const showNote = (differentString) => {
    notification.open({
      message: "Cảnh báo",
      description: convertNote(differentString),
    });
  };

  const convertNote = (notification) => {
    let updatedNotification = notification;

    // Tìm và thay thế tất cả các khớp với roomRegex trong notification
    const roomRegex = /phòng (\d+)/g;
    let roomMatch;
    while ((roomMatch = roomRegex.exec(notification)) !== null) {
      const roomNumber = parseInt(roomMatch[1], 10);
      if (roomNumber >= 0 && roomNumber < roomData.length) {
        updatedNotification = updatedNotification.replace(
          `phòng ${roomNumber}`,
          `${roomData[roomNumber].name}`
        );
      }
    }

    // Tìm và thay thế tất cả các khớp với shiftRegex trong notification
    const shiftRegex = /ca (\d+)/g;
    let shiftMatch;
    while ((shiftMatch = shiftRegex.exec(notification)) !== null) {
      const shiftNumber = parseInt(shiftMatch[1], 10);
      if (shiftNumber >= 0 && shiftNumber < workday.length) {
        updatedNotification = updatedNotification.replace(
          `ca ${shiftNumber}`,
          `ca ${workday[shiftNumber]}`
        );
      }
    }

    // Tìm và thay thế tất cả các khớp với doctorRegex trong notification
    const doctorRegex = /Bác sĩ (\d+)/g;
    let doctorMatch;
    while ((doctorMatch = doctorRegex.exec(notification)) !== null) {
      console.log(doctorData);
      const doctorNumber = parseInt(doctorMatch[1], 10);
      if (doctorNumber >= 0 && doctorNumber < doctorData.length) {
        updatedNotification = updatedNotification.replace(
          `Bác sĩ ${doctorNumber}`,
          `Bác sĩ ${doctorData[doctorNumber].Name}`
        );
      }
    }
    return updatedNotification;
  };

  const renderNotifications = (noti) => {
    return noti.map((notification, index) => {
      let updatedNotification = convertNote(notification);

      return (
        <div
          key={index}
          style={{
            background: "#F8F4E3",
            borderColor: colors.redAccent[500],
            borderWidth: "2px",
            borderStyle: "solid",
            padding: 5,
            margin: 5,
          }}
        >
          {updatedNotification}
        </div>
      );
    });
  };

  const openNotification = () => {
    const key = notification.open({
      message: "Cảnh báo",
      description: (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {renderNotifications(notifications)}
          {/* {console.log(888, notifications[0])} */}
          <Button
            style={{ marginTop: "10px" }}
            onClick={() => {
              setNotifications([]); // Cài đặt lại notifications thành mảng rỗng
              notification.destroy(key); // Đóng thông báo khi nút "Xóa" được nhấp
              //call api to clearout noti.txt
              postDataToServer("/api/noti-write", notifications);
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    });
  };

  return (
    <IconButton onClick={openNotification}>
      <NotificationsOutlinedIcon />
    </IconButton>
  );
};

export default NotificationComponent;

import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { Box, IconButton, useTheme } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { tokens } from "../theme";

const NotificationComponent = ({ notifications, roomData }) => {
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
    const differentStrings = notifications.filter(notification => !oldNotifications.includes(notification));
    console.log(999, differentStrings);
  
    // Join the different strings into a single string
    const differentString = differentStrings.join(", ");
  
    return differentString;
  }

  useEffect(() => {
    const differentString = findDifferentStrings(notifications, oldNotifications);
    if (differentString !== null, differentString.length>0)
      showNote(differentString);
    // console.log(111, (notifications[0]));
    console.log(222, differentString);
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
    notification.open({
      message: "Cảnh báo",
      description: (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {renderNotifications(notifications)}
          {/* {console.log(888, notifications[0])} */}
        </div>
      ),
    });
  };

  return (
    <IconButton>
      <NotificationsOutlinedIcon onClick={openNotification} />
    </IconButton>
  );
};

export default NotificationComponent;

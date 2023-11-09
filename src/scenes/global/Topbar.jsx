import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { fetchDataFromAPI, fetchServerAPI } from "../../data/api";
import NotificationComponent from "../../components/notification";

const Topbar = ({setIsSidebar, updateCheck, setUpdateCheck}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [notifications, setNotifications] = useState([]);
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rmData, response] = await Promise.all([
          fetchDataFromAPI("/room_detail.php"),
          fetchServerAPI("/api/noti"),
        ]);
        setRoomData(rmData);
        setNotifications(response);
        // console.log(111, rmData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    console.log(444, updateCheck);
    fetchData();
    setUpdateCheck(false);
    // console.log(555, updateCheck);
  }, [updateCheck]);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <NotificationComponent
          notifications={notifications}
          roomData={roomData}
        />
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;

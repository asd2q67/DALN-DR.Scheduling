import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDataFromAPI } from "../../data/api";

const Room = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [roomData, setRoomData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "load", headerName: "Load", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromAPI("/room_detail.php");
        setRoomData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading state to false when data fetching is completed
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="ROOMS" subtitle="Managing Rooms" />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DataGrid
          style={{ width: "100%" }}
          checkboxSelection
          rows={roomData}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Room;

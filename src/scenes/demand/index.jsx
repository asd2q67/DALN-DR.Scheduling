import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDataFromAPI } from "../../data/api";

const Demand = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [demandData, setDemandData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomName", headerName: "Room Name", flex: 1 },
    { field: "doctor-num", headerName: "Doctor Num", flex: 1 },
    { field: "demand0", headerName: "Demand for Low", flex: 1 },
    { field: "demand1", headerName: "Demand for Medium", flex: 1 },
    { field: "demand2", headerName: "Demand for High", flex: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demandData = await fetchDataFromAPI("/demand.php");
        const roomData = await fetchDataFromAPI("/room_detail.php");
        // console.log(demandData);
        // Map room-id to room name in demand data
        const mappedDemandData = demandData.map(demand => {
          const room = roomData.find(room => room.id === demand['room-id']);
          return {
            ...demand,
            roomName: room ? room.name : 'N/A', // Set room name or 'N/A' if not found
          };
        });

        setDemandData(mappedDemandData);
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
      <Header title="DEMAND" subtitle="View Demand Data" />
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
          rows={demandData}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Demand;

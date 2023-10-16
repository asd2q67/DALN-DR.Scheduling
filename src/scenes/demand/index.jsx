import React, { useEffect, useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDataFromAPI, updateDataToAPI } from "../../data/api";
import DemandModal from "../../components/DemandModal";

const Demand = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [demandData, setDemandData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "roomName",
      headerName: "Room Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "demand0",
      headerName: "Yêu cầu về người không có kinh nghiệm",
      flex: 1,
    },
    { field: "demand1", headerName: "Yêu cầu về người Làm được", flex: 1 },
    { field: "demand2", headerName: "Yêu cầu về người Làm tốt", flex: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demandData = await fetchDataFromAPI("/demand.php");
        const roomData = await fetchDataFromAPI("/room_detail.php");
        // console.log(demandData);
        // Map room-id to room name in demand data
        const mappedDemandData = demandData.map((demand) => {
          const room = roomData.find((room) => room.id === demand["room-id"]);
          return {
            ...demand,
            roomName: room ? room.name : "N/A", // Set room name or 'N/A' if not found
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

  const handleRowClick = (params) => {
    const selectedId = params.row.id;
    if (selectedRowIds.includes(selectedId)) {
      setSelectedRowIds((prevSelectedRowIds) =>
        prevSelectedRowIds.filter((id) => id !== selectedId)
      );
    } else {
      setSelectedRowIds((prevSelectedRowIds) => [
        ...prevSelectedRowIds,
        selectedId,
      ]);
    }
  };

  const handleEditClick = () => {
    const selectedRow = demandData.find((row) => row.id === selectedRowIds[0]);
    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setIsModalOpen(true);
    }
  };

  const updateDemand = async (updatedData) => {
    try {
      const response = await updateDataToAPI(
        `/demand_update.php?id=${updatedData.id}`,
        updatedData
      );
      console.log(`Successfully updated demand with ID ${updatedData.id}`);
      const updatedDemandData = await fetchDataFromAPI("/demand.php");
      setDemandData(updatedDemandData);
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="DEMAND" subtitle="Demand for Rooms" />

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginBottom="20px"
      >
        <Button
          variant="contained"
          color="secondary"
          disabled={selectedRowIds.length === 0}
          onClick={() => handleEditClick()}
        >
          Edit demand
        </Button>
      </Box>
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
          rows={demandData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
      {selectedRowData && (
        <DemandModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          rowData={selectedRowData}
          handleUpdate={updateDemand}
        />
      )}
    </Box>
  );
};

export default Demand;

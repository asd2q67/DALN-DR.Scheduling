import React, { useEffect, useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  fetchDataFromAPI,
  deleteDataFromAPI,
  updateDataToAPI,
} from "../../data/api";
import EditRoomModal from "../../components/EditRoomModal";

const Room = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [roomData, setRoomData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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

  const handleDeleteClick = async () => {
    try {
      for (const id of selectedRowIds) {
        await deleteDataFromAPI(`/room_delete.php?id=${id}`);
        console.log(`Successfully deleted room with ID ${id}`);
      }

      const updatedData = await fetchDataFromAPI("/room_detail.php");
      setRoomData(updatedData);
      setSelectedRowIds([]);
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error during fetch: " + error.message);
    }
  };

  const handleEditClick = () => {
    const selectedRow = roomData.find((row) => row.id === selectedRowIds[0]);
    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setIsModalOpen(true);
    }
  };

  const updateToAPI = async (updatedData) => {
    try {
      const response = await updateDataToAPI(`/room_update.php?id=${updatedData.id}`, updatedData);
      console.log(`Successfully updated room with ID ${updatedData.id}`);
      const updatedRoomData = await fetchDataFromAPI("/room_detail.php");
      setRoomData(updatedRoomData);
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="ROOMS" subtitle="Managing Rooms" />

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginBottom="20px"
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteClick}
          disabled={selectedRowIds.length === 0}
        >
          Delete Selected Rooms
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleEditClick}
          disabled={selectedRowIds.length === 0}
          sx={{
            ml: "10px",
          }}
        >
          Edit Selected Rooms
        </Button>
        {selectedRowData && (
          <EditRoomModal
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            rowData={selectedRowData}
            handleUpdate={updateToAPI}
          />
        )}
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
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
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          style={{ width: "100%" }}
          checkboxSelection
          rows={roomData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};

export default Room;

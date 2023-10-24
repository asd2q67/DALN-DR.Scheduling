import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  deleteDataFromAPI,
  fetchDataFromAPI,
  updateDataToAPI,
} from "../../data/api";
import { Box, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import EditAssignModel from "../../components/EditAssignModel";

const WorkAssignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [roomData, setRoomData] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [workAssignments, setWorkAssignments] = useState([]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        await deleteDataFromAPI(`/assignment_delete.php?id=${id}`);
        console.log(`Successfully deleted room with ID ${id}`);
      }

      const updatedData = await fetchDataFromAPI("/work_detail.php");
      setWorkAssignments(updatedData);
      setSelectedRowIds([]);
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error during fetch: " + error.message);
    }
  };

  const handleEditClick = async () => {
    try {
      // Lấy thông tin của bản ghi được chọn
      const selectedRowId = selectedRowIds[0];
      const selectedRow = workAssignments.find(
        (row) => row.id === selectedRowId
      );

      // Hiển thị modal chỉnh sửa với thông tin của bản ghi được chọn
      setSelectedRowData(selectedRow);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error during fetch: " + error.message);
    }
  };

  const updateToAPI = async (updatedData) => {
    try {
      const response = await updateDataToAPI(
        `/assignment_update.php?id=${updatedData.id}`,
        updatedData
      );
      console.log(`Successfully updated room with ID ${updatedData.id}`);
      const updatedWorkAssignments  = await fetchDataFromAPI("/work_detail.php");
      setWorkAssignments(updatedWorkAssignments );
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  useEffect(() => {
    // Gọi API để lấy chi tiết các phòng và cập nhật vào state roomData
    const fetchroomData = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        // console.log("room", response);
        setRoomData(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    // Gọi API để lấy chi tiết các bác sĩ và cập nhật vào state doctorDetails
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/dr_detail.php");
        // console.log("doctor", response);
        setDoctorDetails(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    const fetchWorkAssignments = async () => {
      try {
        const response = await fetchDataFromAPI("/work_detail.php");
        setWorkAssignments(response);
      } catch (error) {
        console.error("Error fetching work assignments:", error);
      }
    };

    fetchroomData();
    fetchDoctorDetails();
    fetchWorkAssignments();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "room",
      headerName: "Room",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.room === "-1") {
          return "Nghỉ phép";
        }
        // Lấy tên phòng từ API hoặc từ một nguồn dữ liệu đã có
        const roomInfo = roomData.find((room) => room.id === params.row.room);
        return roomInfo ? roomInfo.name : "";
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => {
        const date = params.row.date;
        return date ? date : "";
      },
    },
    {
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      valueGetter: (params) => {
        // Lấy tên bác sĩ từ API hoặc từ một nguồn dữ liệu đã có
        const doctorInfo = doctorDetails.find(
          (doctor) => doctor.id === params.row.doctor_id
        );
        // console.log(1111, params.row);
        return doctorInfo ? doctorInfo.Name : "";
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Work Assignment" subtitle="This Month Assignments" />

      {/* nút bấm */}
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
          Delete Selected Assignment
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
          Edit Selected Assignment
        </Button>
        {selectedRowData && (
          <EditAssignModel
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            rowData={selectedRowData}
            handleUpdate={updateToAPI}
          />
        )}
      </Box>

      {/* Hiển thị thông tin */}
      <Box
        m="40px 0 0 0"
        height="65vh"
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
          rows={workAssignments}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};

export default WorkAssignment;

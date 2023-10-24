import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  fetchDataFromAPI,
  deleteDataFromAPI,
  updateDataToAPI,
} from "../../data/api";
import "./style.css";
import EditModal from "../../components/EditModal";

const Doctor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctorData, setDoctorData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [roomDetails, setRoomDetails] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        setRoomDetails(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
  
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/dr_detail.php");
        setDoctorDetails(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
  
    fetchRoomDetails();
    fetchDoctorDetails();
  }, []);
  

  const handleRowClick = (params) => {
    const selectedId = params.row.id;
    if (selectedRowIds.includes(selectedId)) {
      // Nếu ID đã chọn, loại bỏ nó khỏi danh sách
      setSelectedRowIds((prevSelectedRowIds) =>
        prevSelectedRowIds.filter((id) => id !== selectedId)
      );
    } else {
      // Nếu ID chưa chọn, thêm nó vào danh sách
      setSelectedRowIds((prevSelectedRowIds) => [
        ...prevSelectedRowIds,
        selectedId,
      ]);
    }
  };

  const handleDeleteClick = async () => {
    try {
      for (const id of selectedRowIds) {
        // Use deleteDataFromAPI function to delete data by ID
        await deleteDataFromAPI(`/dr_delete.php?id=${id}`);
        console.log(`Successfully deleted item with ID ${id}`);
      }

      // Fetch updated doctor data after successful deletion
      const updatedData = await fetchDataFromAPI("/dr_detail.php");
      setDoctorData(updatedData);

      // Clear the selected IDs after deletion
      setSelectedRowIds([]);
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Error during fetch: " + error.message);
    }
  };

  const handleEditClick = () => {
    // Lấy dữ liệu của hàng được chọn
    const selectedRow = doctorData.find((row) => row.id === selectedRowIds[0]);
    // Nếu có dữ liệu, hiển thị modal sửa
    if (selectedRow) {
      setSelectedRowData(selectedRow);
      setIsModalOpen(true);
    }
    // console.log("selectedRowIds", selectedRowIds);
  };

  const updateToAPI = async (updatedData) => {
    try {
      // Gửi dữ liệu cập nhật thông qua API sử dụng hàm updateDataToAPI
      const response = await updateDataToAPI(`/dr_update.php?id=${updatedData.id}`, updatedData);
      console.log(`Successfully updated item with ID ${updatedData.id}`);
      // Nếu cần, cập nhật lại danh sách bác sĩ sau khi cập nhật
      const updatedDoctorData = await fetchDataFromAPI("/dr_detail.php");
      setDoctorData(updatedDoctorData);
    } catch (error) {
      console.error("Error during update:", error);
      // Xử lý lỗi khi cập nhật dữ liệu
    }
  };
  

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Skills",
      headerName: "Skills",
      flex: 3,
      cellClassName: "skill-column--cell",
      renderCell: (params) => {
        const skills = roomDetails.map((room) => {
          const doctorDetail = doctorDetails.find((doctor) => doctor.id === params.row.id);
          const level = doctorDetail ? doctorDetail[`R${room.id}`] : "0";
          return {
            name: room.name,
            level: level,
          };
        });

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {skills.map((skill, index) => (
              <div key={index} style={{ marginRight: "10px" }}>
                <Typography variant="body1">{`${skill.name} `}</Typography>
                {skill.level === "0" && (
                  <span style={{ color: colors.redAccent[300] }}>Không kinh nghiệm</span>
                )}
                {skill.level === "1" && (
                  <span style={{ color: "orange" }}>Làm được</span>
                )}
                {skill.level === "2" && (
                  <span style={{ color: colors.greenAccent[300] }}>Làm tốt</span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataFromAPI("/dr_detail.php");
        setDoctorData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading state to false when data fetching is completed
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        setRoomDetails(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
  
    fetchRoomDetails();
  }, []);
  

  return (
    <Box m="20px">
      <Header title="DOCTOR" subtitle="Managing the Doctor Members" />

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
          Delete Selected Doctor
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
          Edit Selected Doctors
        </Button>
        {/* {console.log(111, selectedRowData)} */}
        {selectedRowData && (
          <EditModal
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            rowData={selectedRowData}
            handleUpdate={updateToAPI}
            roomDetails={roomDetails}
          />
        )}
      </Box>

      <Box
        m="40px 0 0 0"
        height="65vh"
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
          "& .skill-column--cell": {
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
          rows={doctorData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};

export default Doctor;
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDataFromAPI, deleteDataFromAPI } from "../../data/api";
import "./style.css";

const Doctor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctorData, setDoctorData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

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
    // console.log("111", selectedRowIds);
  };

  const handleDeleteClick = async () => {
    try {
      for (const id of selectedRowIds) {
        // Use deleteDataFromAPI function to delete data by ID
        await deleteDataFromAPI(`/dr_detail.php?id=${id}`);
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
        const skills = [
          { name: "Phòng 309 (KKB) TH1", level: params.row.R1 },
          { name: "Phòng 309 (KKB) TH2", level: params.row.R2 },
          { name: "Phòng 309 (KKB) TH3", level: params.row.R3 },
          { name: "PK nhà K1 703", level: params.row.R4 },
          { name: "PK nhà K1 704", level: params.row.R5 },
          { name: "PK nhà K1 705", level: params.row.R6 },
          { name: "PK nhà K1 707", level: params.row.R7 },
        ];

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
                  <span style={{ color: colors.redAccent[300] }}>Low</span>
                )}
                {skill.level === "1" && (
                  <span style={{ color: "orange" }}>Medium</span>
                )}
                {skill.level === "2" && (
                  <span style={{ color: colors.greenAccent[300] }}>High</span>
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
        const data = await fetchDataFromAPI("/dr_detail.php")
        
        setDoctorData(data);
        // console.log(data);
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
          Delete Selected Doctors
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

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchDataFromAPI } from "../../data/api";
import "./style.css";

const Doctor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doctorData, setDoctorData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


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
                {skill.level === "0" && <span style={{ color: "red" }}>Low</span>}
                {skill.level === "1" && (
                  <span style={{ color: "orange" }}>Medium</span>
                )}
                {skill.level === "2" && (
                  <span style={{ color: "green" }}>High</span>
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
        const data = await fetchDataFromAPI("http://localhost/src/php/dr_detail.php");
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
        />
      </Box>
    </Box>
  );
};

export default Doctor;

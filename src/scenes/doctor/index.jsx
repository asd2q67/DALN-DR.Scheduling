import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataDocs } from "../../data/mockData";
import Header from "../../components/Header";
import "./style.css"

const Doctor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "skills",
      headerName: "Skills",
      flex: 3,
      renderCell: (params) => {
        const skills = params.row.skills;
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              overflowY: "auto",
            }}
          >
            {skills.map((skill, index) => (
              <div key={index} style={{ marginRight: "10px" }}>
                <Typography variant="body1">{`${skill.name} `}</Typography>
                {skill.level === 0 && <span style={{ color: "red" }}>Low</span>}
                {skill.level === 1 && (
                  <span style={{ color: "orange" }}>Medium</span>
                )}
                {skill.level === 2 && (
                  <span style={{ color: "green" }}>High</span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Doctor" subtitle="Managing the Doctor Members" />
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
        <DataGrid checkboxSelection rows={mockDataDocs} columns={columns} />
      </Box>
    </Box>
  );
};

export default Doctor;

import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

const Room = () => {
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
            field: "heavy",
            headerName: "Heavy",
            flex: 1,
        }
    ]

  return (
    <Box m="20px">
      <Header title="ROOM" subtitle="Hospital treatment rooms" />
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        
      </Box>
    </Box>
  );
};

export default Room;

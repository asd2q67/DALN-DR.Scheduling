import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MedicationIcon from "@mui/icons-material/Medication";
import SickIcon from "@mui/icons-material/Sick";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Calendar
          </Button>
        </Box>
      </Box>

      {/* Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      ></Box>
      <Box
        gridColumn="span 4"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="1,012"
          subtitle="Doctor"
          icon={
            <MedicationIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }
        />
      </Box>
      <Box
        gridColumn="span 4"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="21,354"
          subtitle="Patient"
          icon={
            <SickIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }
        />
      </Box>
      <Box
        gridColumn="span 4"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          title="126"
          subtitle="Interns"
          icon={
            <PersonAddIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

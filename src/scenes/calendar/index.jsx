import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Doctors Calendar" />
    </Box>
  );
};

export default Calendar;

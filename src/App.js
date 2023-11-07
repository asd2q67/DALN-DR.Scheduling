import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Sidebar from "./scenes/global/Sidebar";
import Doctor from "./scenes/doctor";
import Calendar from "./scenes/calendar";
import Room from "./scenes/Room";
import Demand from "./scenes/demand";
import CreateRoom from "./scenes/CreateRoom";
import CreateDoctor from "./scenes/CreateDoctor";
import WorkAssign from "./scenes/workAssign";
import WorkAssignment from "./scenes/workAssignment";
import CSVComponent from "./notification/CSVComponent";
import DropDownNotification from "./notification/notification";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
 
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar}/>
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar}/>
            <CSVComponent />
            <DropDownNotification data={data} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/doctor" element={<Doctor />} />
              <Route path="/create_doctor" element={<CreateDoctor />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/room" element={<Room />} />
              <Route path="/create_room" element={<CreateRoom />} />
              <Route path="/demand" element={<Demand />} />
              <Route path="/work_assign" element={<WorkAssign />} />
              <Route path="/work_assignment" element={<WorkAssignment />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

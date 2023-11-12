// server.js (Backend Node.js)

const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

const CSV_FILE_PATH =
  "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\solution.csv";
const CSV_FILE_PATH2 =
  "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\doctor_calendar.csv";
const BACKUP_FILE_PATH =
  "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\solution_backup.csv";
const BACKUP_FILE_PATH2 =
  "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\doctor_calendar_backup.csv";

//data - solution
app.get("/api/data", (req, res) => {
  const results = [];
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error reading CSV file." });
    });
});
const backupSolutionData = async () => {
  try {
    const results = [];

    // Read the existing solution CSV file
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        // Write the solution data to the backup file
        fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(results), "utf-8");
        console.log("Solution data backup created successfully");
      })
      .on("error", (error) => {
        console.error("Error reading solution CSV file:", error.message);
      });
  } catch (error) {
    console.error("Error creating solution data backup:", error.message);
  }
};
const restoreSolutionData = async () => {
  try {
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE_PATH, "utf-8"));

    // Extract headers from the first row
    const headers = Object.keys(backupData[0]);

    // Convert the array of objects to CSV format, including headers
    const csvData = [
      headers.join(","),
      ...backupData.map((row) =>
        headers.map((key) => JSON.stringify(row[key])).join(",")
      ),
    ].join("\n");

    // Write the CSV data back to the solution CSV file
    fs.writeFileSync(CSV_FILE_PATH, csvData, "utf-8");
    console.log("Solution data restored from backup");
  } catch (error) {
    console.error("Error restoring solution data from backup:", error.message);
  }
};
app.post("/api/backup-data", async (req, res) => {
  try {
    await backupSolutionData();
    res.send("Solution data backup created successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/api/restore-data", async (req, res) => {
  try {
    await restoreSolutionData();
    res.send("Solution data restored from backup");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//csv - doctor
app.get("/api/doctor-schedules", (req, res) => {
  const results = [];
  fs.createReadStream(CSV_FILE_PATH2)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error reading CSV file." });
    });
});
const backupDoctorSchedules = async () => {
  try {
    const results = [];

    // Read the existing doctor schedules CSV file
    fs.createReadStream(CSV_FILE_PATH2)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        // Write the doctor schedules data to the backup file
        fs.writeFileSync(BACKUP_FILE_PATH2, JSON.stringify(results), "utf-8");
        console.log("Doctor schedules backup created successfully");
      })
      .on("error", (error) => {
        console.error(
          "Error reading doctor schedules CSV file:",
          error.message
        );
      });
  } catch (error) {
    console.error("Error creating doctor schedules backup:", error.message);
  }
};
app.post("/api/backup-doctor-schedules", async (req, res) => {
  try {
    await backupDoctorSchedules();
    res.send("Doctor schedules backup created successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
const restoreDoctorSchedules = async () => {
  try {
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE_PATH2, "utf-8"));

    // Extract headers from the first row
    const headers = Object.keys(backupData[0]);

    // Convert the array of objects to CSV format, including headers
    const csvData = [
      headers.join(","),
      ...backupData.map((row) => headers.map((key) => row[key]).join(",")),
    ].join("\n");
    fs.writeFileSync(CSV_FILE_PATH2, csvData, "utf-8");
    console.log("Doctor schedules data restored from backup");
  } catch (error) {
    console.error(
      "Error restoring doctor schedules from backup:",
      error.message
    );
  }
};
app.post("/api/restore-doctor-schedules", async (req, res) => {
  try {
    await restoreDoctorSchedules();
    res.send("Doctor schedules data restored from backup");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

//notification
app.get("/api/noti", (req, res) => {
  const filename = "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\noti.txt";
  fs.readFile(filename, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      const notis = data
        .toString()
        .split("\n")
        .filter((line) => line.trim() !== "");
      res.json(notis);
    }
  });
});
app.post("/api/noti-write", (req, res) => {
  const filename = "D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\noti.txt";
  const notiData = req.body.noti; // Assuming noti is a string
  fs.writeFileSync(filename, "", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error writing to file");
    } else {
      res.send("Notification saved successfully");
    }
  });
});
//save-csv
app.post("/save-csv", (req, res) => {
  const csvData = req.body.data;
  fs.writeFileSync(CSV_FILE_PATH, csvData, "utf-8");
  res.send("File CSV đã được lưu.");
});
app.post("/save-doctor-csv", (req, res) => {
  try {
    const csvData = req.body.data; // Assumed that the data is an array of objects

    const header = Object.keys(csvData[0]).join(",");
    // Convert array of objects to CSV format
    // const exam = `"${csvData.map((row) => {
    //   const array = Object.values(row).map(element => `"${element}"`).join(',');
    //   console.log(444, array);
    // })}"`;
    const csvContent = `${header}\n${csvData
      .map((row) => Object.values(row).map(element => `"${element}"`).join(","))
      .join("\n")}`;
    // Write CSV data to the file
    fs.writeFileSync(CSV_FILE_PATH2, csvContent, "utf-8");

    res.send("Doctor schedules CSV file has been updated.");
  } catch (error) {
    console.error("Error updating doctor schedules CSV file:", error);
    res.status(500).send("Internal Server Error");
  }
});
//export
app.post("/export-csv", (req, res) => {
  const csvData = req.body.data; // Dữ liệu CSV từ máy khách

  // Ghi dữ liệu CSV vào tệp tin
  fs.writeFileSync(
    "C:\\Users\\Lenovo\\OneDrive\\OneDrive - Phenikaa\\Desktop\\calendar.csv",
    csvData,
    "utf-8"
  );

  // Phản hồi với thông điệp cho máy khách
  res.send("File CSV đã được lưu.");
});
app.post("/personal-csv", (req, res) => {
  const csvData = req.body.data; // Dữ liệu CSV từ máy khách

  // Ghi dữ liệu CSV vào tệp tin
  fs.writeFileSync(
    "C:\\Users\\Lenovo\\OneDrive\\OneDrive - Phenikaa\\Desktop\\Personal-calendar.csv",
    csvData,
    "utf-8"
  );

  // Phản hồi với thông điệp cho máy khách
  res.send("File CSV đã được lưu.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

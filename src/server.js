// server.js (Backend Node.js)

const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.get('/api/data', (req, res) => {
  const results = [];
  fs.createReadStream('D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\solution.csv')
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading CSV file.' });
    });
});
app.get('/api/doctor-schedules', (req, res) => {
  const results = [];
  fs.createReadStream('D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\doctor_calendar.csv')
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading CSV file.' });
    });
});
app.get('/api/noti', (req, res) => {
  const filename = 'D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\noti.txt';
  fs.readFile(filename, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      const notis = data.toString().split('\n').filter(line => line.trim() !== '');
      res.json(notis);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/save-csv', (req, res) => {
  const csvData = req.body.data;
  fs.writeFileSync('D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\solution.csv', csvData, 'utf-8');
  res.send('File CSV đã được lưu.');
});
app.post('/export-csv', (req, res) => {
  const csvData = req.body.data; // Dữ liệu CSV từ máy khách

  // Ghi dữ liệu CSV vào tệp tin
  fs.writeFileSync('C:\\Users\\Lenovo\\OneDrive\\OneDrive - Phenikaa\\Desktop\\calendar.csv', csvData, 'utf-8');

  // Phản hồi với thông điệp cho máy khách
  res.send('File CSV đã được lưu.');
});
app.post('/personal-csv', (req, res) => {
  const csvData = req.body.data; // Dữ liệu CSV từ máy khách

  // Ghi dữ liệu CSV vào tệp tin
  fs.writeFileSync('C:\\Users\\Lenovo\\OneDrive\\OneDrive - Phenikaa\\Desktop\\Personal-calendar.csv', csvData, 'utf-8');

  // Phản hồi với thông điệp cho máy khách
  res.send('File CSV đã được lưu.');
});

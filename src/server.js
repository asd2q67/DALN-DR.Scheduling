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
  fs.writeFileSync('D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\calendar.csv', csvData, 'utf-8');

  // Phản hồi với thông điệp cho máy khách
  res.send('File CSV đã được lưu.');
});
app.post('/personal-csv', (req, res) => {
  const csvData = req.body.data; // Dữ liệu CSV từ máy khách

  // Ghi dữ liệu CSV vào tệp tin
  fs.writeFileSync('D:\\Workspace\\Doanliennganh\\DALN-DR.Scheduling\\calendar1.csv', csvData, 'utf-8');

  // Phản hồi với thông điệp cho máy khách
  res.send('File CSV đã được lưu.');
});

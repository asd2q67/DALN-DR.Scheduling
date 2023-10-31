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
  fs.createReadStream('D:\\Workspace\\Đồ án liên ngành\\DALN-DR.Scheduling\\solution.csv')
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

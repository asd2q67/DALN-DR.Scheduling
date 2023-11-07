import React, { useState, useEffect } from 'react';

function CSVComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('noti.csv')
      .then(response => response.text())
      .then(data => {
        const csvData = data.trim().split('\n');
        const headers = csvData[0].split(',');
        const filteredData = csvData.filter((row) => {
          return row.indexOf('Title') !== -1 && row.indexOf('Message') !== -1;
        });
          const parsedData = filteredData.map((row) => {
          const title = row.split(',')[0];
          const message = row.split(',')[1];
          return { title, message };
        });
        setData(parsedData);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.title}>{item.title} - {item.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default CSVComponent;
import axios from "axios";
import { API_BASE_URL, API_NODE_URL, API_PYTHON_URL } from "./config";


export const fetchServerAPI = async (endpoint) => {
  try {
    const response = await axios.get(`${API_NODE_URL}${endpoint}`);
    // console.log(111, response);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};
// Function to fetch data from the API using GET request
export const fetchDataFromAPI = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};

// Function to delete data using DELETE request
export const deleteDataFromAPI = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};

// Function to add new data using POST request
export const postDataToAPI = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};
export const postDataToServer = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_NODE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};

// Function to update data using PUT request
export const updateDataToAPI = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};

export const saveToServer = (endpoint, csvData) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_NODE_URL}/${endpoint}`, { data: csvData }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
  });
};
export const initCalendar = (endpoint) => {
  return new Promise((resolve, reject) => {
    axios.post(`${API_PYTHON_URL}/${endpoint}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
  });
};
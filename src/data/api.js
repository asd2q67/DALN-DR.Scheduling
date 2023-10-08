// api.js
import axios from "axios";

export const fetchDataFromAPI = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error; // Handle errors in the component where the function is used
  }
};

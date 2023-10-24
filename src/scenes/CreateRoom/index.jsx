import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { fetchDataFromAPI, postDataToAPI } from "../../data/api";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  Name: yup.string().required("Required"),
  Load: yup.number().required("Required"),
  Priority: yup.number().required("Required"),
  Demand0: yup.number().required("Required"),
  Demand1: yup.number().required("Required"),
  Demand2: yup.number().required("Required"),
});

const CreateRoom = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState([]);
  const [initialValues, setInitialValues] = useState({
    Name: "",
    Load: 0,
    Priority: 0,
    Demand0: 0,
    Demand1: 0,
    Demand2: 0,
  });

  const handleFormSubmit = async (values) => {
    console.log(values);
    try {
      const response = await postDataToAPI("/room_add.php", {
        name: values.Name,
        load: values.Load,
        priority: values.Priority,
        demand0: values.Demand0,
        demand1: values.Demand1,
        demand2: values.Demand2,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response from server:", response);
  
      setIsSuccess(true);
  
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/room"); // Redirect to the rooms page after success
      }, 2000);
    } catch (error) {
      console.error("Error submitting room form:", error);
    }
  };
  
  

  useEffect(() => {
    let timer;
    if (isSuccess) {
      // Hide the alert after 2 seconds
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }

    // Clear the timer if the component unmounts or if isSuccess becomes false
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  return (
    <Box m="20px">
      <Header title="CREATE ROOM" subtitle="Create a New Room" />

      <div className={`custom-alert ${isSuccess ? "" : "hide-alert"}`}>
        Create room successfully!
      </div>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              mb="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr)"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Name}
                name="Name"
                error={!!touched.Name && !!errors.Name}
                helperText={touched.Name && errors.Name}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Load"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Load}
                name="Load"
                error={!!touched.Load && !!errors.Load}
                helperText={touched.Load && errors.Load}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Priority"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Priority}
                name="Priority"
                error={!!touched.Priority && !!errors.Priority}
                helperText={touched.Priority && errors.Priority}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Demand0"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Demand0}
                name="Demand0"
                error={!!touched.Demand0 && !!errors.Demand0}
                helperText={touched.Demand0 && errors.Demand0}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Demand1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Demand1}
                name="Demand1"
                error={!!touched.Demand1 && !!errors.Demand1}
                helperText={touched.Demand1 && errors.Demand1}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Demand2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Demand2}
                name="Demand2"
                error={!!touched.Demand2 && !!errors.Demand2}
                helperText={touched.Demand2 && errors.Demand2}
                sx={{ gridColumn: "span 2", mb: "10px" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Room
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default CreateRoom;

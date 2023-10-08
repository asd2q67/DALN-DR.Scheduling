import {
  Box,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import axios from "axios";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import "./style.css";

const initialValues = {
  Name: "",
  R1: "0",
  R2: "0",
  R3: "0",
  R4: "0",
  R5: "0",
  R6: "0",
  R7: "0",
};

const validationSchema = yup.object({
  Name: yup.string().required("Required"),
  R1: yup.string().required("Required"),
  R2: yup.string().required("Required"),
  R3: yup.string().required("Required"),
  R4: yup.string().required("Required"),
  R5: yup.string().required("Required"),
  R6: yup.string().required("Required"),
  R7: yup.string().required("Required"),
});

const fieldMapping = {
  R1: "Phòng 309 (KKB) TH1",
  R2: "Phòng 309 (KKB) TH2",
  R3: "Phòng 309 (KKB) TH3",
  R4: "PK nhà K1 703",
  R5: "PK nhà K1 704",
  R6: "PK nhà K1 705",
  R7: "PK nhà K1 707",
};

const MyForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post(
        "http://localhost/src/php/post_handler.php",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setIsSuccess(true);

      // Reset input and radio buttons after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        resetForm(); // Reset form values
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (isSuccess) {
      // Hide the alert after 5 seconds
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }

    // Clear the timer if the component unmounts or if isSuccess becomes false
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <div className={`custom-alert ${isSuccess ? "" : "hide-alert"}`}>
        Form submitted successfully!
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
              gap="30px"
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
                sx={{ gridColumn: "span 4" }}
              />
              {Object.entries(fieldMapping).map(([fieldName, displayName]) => (
                <React.Fragment key={fieldName}>
                  <div style={{ color: colors.greenAccent[200] }}>
                    {displayName}
                  </div>
                  <RadioGroup
                    name={fieldName}
                    value={values[fieldName] || "0"} // Default value to "0" if undefined
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="0"
                      control={
                        <Radio
                          sx={{
                            color: `${colors.greenAccent[200]} !important`,
                          }}
                        />
                      }
                      label="Low"
                      defaultChecked
                    />
                    <FormControlLabel
                      value="1"
                      control={
                        <Radio
                          sx={{
                            color: `${colors.greenAccent[200]} !important`,
                          }}
                        />
                      }
                      label="Medium"
                    />
                    <FormControlLabel
                      value="2"
                      control={
                        <Radio
                          sx={{
                            color: `${colors.greenAccent[200]} !important`,
                          }}
                        />
                      }
                      label="High"
                    />
                  </RadioGroup>
                </React.Fragment>
              ))}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default MyForm;

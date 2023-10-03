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
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import "./style.css";

const initialValues = {
  Name: "",
  skills: [
    { name: "Phòng 309 (KKB) TH1", level: 0 },
    { name: "Phòng 309 (KKB) TH2", level: 0 },
    { name: "Phòng 309 (KKB) TH3", level: 0 },
    { name: "PK nhà K1 703", level: 0 },
    { name: "PK nhà K1 704", level: 0 },
    { name: "PK nhà K1 705", level: 0 },
    { name: "PK nhà K1 707", level: 0 },
    { name: "PK nhà K1 708", level: 0 },
    { name: "PK nhà K1 709", level: 0 },
    { name: "Điều trị tầng 9 K1", level: 0 },
  ],
};

const checkoutSchema = yup.object().shape({
  Name: yup.string().required("required"),
});

const MyForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFormSubmit = (values, { resetForm }) => {
    console.log(values);
    setIsSuccess(true);

    // Reset input and radio buttons after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
      resetForm(); // Reset form values
    }, 5000);
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
        validationSchema={checkoutSchema}
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
              {values.skills.map((skill, index) => (
                <React.Fragment key={index}>
                  <div style={{ color: colors.greenAccent[200] }}>
                    {skill.name}
                  </div>
                  <RadioGroup
                    name={`skills[${index}].level`}
                    value={values.skills[index].level}
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

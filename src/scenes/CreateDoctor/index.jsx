// Import các dependencies và components cần thiết
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { postDataToAPI, fetchDataFromAPI } from "../../data/api"; // Import hàm gửi yêu cầu API từ module api của bạn
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const validationSchema = yup.object({
  Name: yup.string().required("Required"),
});

const CreateDoctor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSuccess, setIsSuccess] = useState(false);
  const [roomDetails, setRoomDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy chi tiết các phòng và cập nhật vào state roomDetails
    const fetchRoomDetails = async () => {
      try {
        const response = await fetchDataFromAPI("/room_detail.php");
        setRoomDetails(response);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, []);

  const initialValues = {
    Name: "",
    ...roomDetails.reduce((acc, room) => {
      acc[`R${room.id}`] = "0";
      return acc;
    }, {}),
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Gửi yêu cầu POST đến API để tạo bác sĩ mới
      const response = await postDataToAPI("/dr_create.php", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsSuccess(true);

      // Reset form và ẩn thông báo thành công sau 2 giây
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
        navigate("/doctor");
      }, 2000);
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
      <Header title="CREATE DOCTOR" subtitle="Create a New Doctor Profile" />

      <div className={`custom-alert ${isSuccess ? "" : "hide-alert"}`}>
        Form submitted successfully!
      </div>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiTypography-root": {
            border: "none",
          },
          "& .MuiButtonBase-root": {color: colors.greenAccent[300]}
        }}
      >
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
                  sx={{ gridColumn: "span 4" }}
                />
                {roomDetails.map((room) => (
                  <React.Fragment key={room.id}>
                    <Typography variant="body1" sx={{ gridColumn: "span 2" }}>
                      {room.name}:
                    </Typography>
                    <RadioGroup
                      name={`R${room.id}`}
                      value={values[`R${room.id}`]}
                      defaultValue="0"
                      onChange={handleChange}
                      row
                      sx={{ gridColumn: "span ２" }}
                    >
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Không kinh nghiệm"
                        style={{ color: colors.redAccent[300] }}
                        defaultChecked
                      />
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        style={{ color: "orange" }}
                        label="Làm được"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        style={{ color: colors.greenAccent[300] }}
                        label="Làm tốt"
                      />
                    </RadioGroup>
                  </React.Fragment>
                ))}
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create Doctor
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateDoctor;

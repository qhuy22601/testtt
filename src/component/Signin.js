import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { backend } from "./utils/APIRoutes";
import {message} from 'antd';
const theme = createTheme();

function Signin() {
  const [resData, setResData] = useState(null);

  let navigate = useNavigate();
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  function toastSuccess(message) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  function toastWarning(message) {
    toast.warning(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  async function postSignInInfo(inputData) {
    const response = await axios({
      method: "post",
      url: `${process.env.REACT_APP_BACK_END}/api/auth/login`,
      data: {
        email: inputData.email,
        password: inputData.password,
      },
    });

    if (response.data !== null && response.data.status === "Fail") {
      toastWarning("Sai mật khẩu hoặc email");
     
      console.log(response.data.status);
    }

    if (response.data !== null && response.data.status === "Success") {
      setResData(response.data.status);
      toastSuccess("Đăng nhập thành công");
      localStorage.setItem("Email", response.data.payload.userModel.email);
      localStorage.setItem("Id", response.data.payload.userModel.id);
      localStorage.setItem(
        "FirstName",
        response.data.payload.userModel.firstName
      );
      localStorage.setItem(
        "LastName",
        response.data.payload.userModel.lastName
      );
      localStorage.setItem(
        "Gender",
        response.data.payload.userModel.gender
      );
      localStorage.setItem("Address", response.data.payload.userModel.address);
      localStorage.setItem(
        "PhoneNumber",
        response.data.payload.userModel.phoneNumber
      );
      localStorage.setItem(
        "isAvatarImageSet",
        true
      );
        localStorage.setItem(
          "UserAvata",
          response.data.payload.userModel.image
        );


      if (response.data.payload.userModel.image != null) {
        localStorage.setItem("Avata", response.data.payload.userModel.image);
      }else{
        localStorage.setItem("Avata", "");

      }
      sessionStorage.setItem(
        "Password",
        response.data.payload.userModel.password
      );
      localStorage.setItem("Token", response.data.payload.token);
      localStorage.setItem(
        "chat-app-current-user",
        JSON.stringify(response.data.payload.userModel)
      );
      navigate("/");
    }
  }

  // const clearLocalStorage = () => {
  //   localStorage.clear();
  // };

  // useEffect(() => {
  //   const interval = setInterval(clearLocalStorage, 10000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <ToastContainer />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Formik
            validationSchema={schema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              postSignInInfo(values);
              setSubmitting(false);
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isInValid,
              errors,
            }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={values.email}
                  autoFocus
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Đăng nhập
                </Button>
                {/* <Grid container>
                  <Grid item xs>
                    <Link variant="body2"></Link>
                  </Grid>
                  <Grid item>
                    <Link variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid> */}
              </Box>
            )}
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
export default Signin;

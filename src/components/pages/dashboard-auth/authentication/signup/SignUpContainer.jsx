import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { onRegister, db } from "../../../../../firebaseConfig";
import styled from "styled-components/macro";
import { setDoc, doc } from "firebase/firestore";



export const SignUpContainer = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.repeatPassword) {
        // Password and repeat password don't match
        alert("Password and Confirm Password must be the same.");
        return;
      }
      let res = await onRegister(values);
      if(res.user.uid){
        await setDoc( doc(db,"users", res.user.uid) , {rol: "user"} )
      }
      navigate("/login");
      return res;
    },

    validateOnChange: false,

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "A minimum of 6 characters is required"),
      repeatPassword: Yup.string()
        .required("Password is required")
        .min(6, "A minimum of 6 characters is required"),
    }),
  });

  return (
    <SignUpWrapper>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          // backgroundColor: theme.palette.secondary.main,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowSpacing={2}
            // alignItems="center"
            justifyContent={"center"}
          >
            <Grid item xs={10} md={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                onChange={handleChange}
                helperText={errors.email}
                error={errors.email ? true : false}
              />
            </Grid>
            <Grid item xs={10} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  helpertext={errors.password}
                  error={errors.password ? true : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff color="primary" />
                        ) : (
                          <Visibility color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                />
              </FormControl>
            </Grid>
            <Grid item xs={10} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirmar contraseña
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  name="repeatPassword"
                  onChange={handleChange}
                  helpertext={errors.repeatPassword}
                  error={errors.repeatPassword ? true : false}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff color="primary" />
                        ) : (
                          <Visibility color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirmar contraseña"
                />
              </FormControl>
            </Grid>
            <Grid container justifyContent="center" spacing={3} mt={2}>
              <Grid item xs={10} md={7}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                    paddingTop: "5px",
                  }}
                >
                  Registrarme
                </Button>
              </Grid>
              <Grid item xs={10} md={7}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/login")}
                  type="button"
                >
                  Regresar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </SignUpWrapper>
  );
};
const SignUpWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
//SIGNUP CREADO POR MI
// import { useNavigate } from "react-router-dom";
// import { SignUp } from "./SignUp";
// import { useFormik } from "formik";
// import { loginWithGoogle, register } from "../../../../firebaseConfig";
// import * as Yup from "yup";

// export const SignUpContainer = () => {
//   const navigate = useNavigate();

//   const { handleSubmit, handleChange, errors } = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },

//     onSubmit: async (values) => {
//       let res = await register(values);
//       navigate("/login");
//       return res
//     },

//     validateOnChange: false,

//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       password: Yup.string()
//         .required("Password is required")
//         .min(6, "A minimum of 6 characters is required"),
//     }),
//   });

//   //Login con Google
//   const handleSubmitGoogle = async () => {
//     let res = await loginWithGoogle();
//     navigate("/");
//     return res;
//   };

//   return (
//     <SignUp
//       handleSubmit={handleSubmit}
//       handleChange={handleChange}
//       handleSubmitGoogle={handleSubmitGoogle}
//       errors={errors}
//     />
//   );
// };

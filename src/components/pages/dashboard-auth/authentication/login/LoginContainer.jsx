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
  Tooltip,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components/macro";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../../../context/AuthContext";
import { db, loginWithGoogle, onLogin } from "../../../../../firebaseConfig";

export const LoginContainer = () => {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      try {
        let res = await onLogin(values);

        if (res.user) {
          const userCollection = collection(db, "users");
          const userRef = doc(userCollection, res.user.uid);
          const userDoc = await getDoc(userRef);
          let finallyUser = {
            email: res.user.email,
            rol: userDoc.data().rol,
          };
          console.log(res.user);
          /* console.log(userDoc.data()); */
          handleLogin(finallyUser);

          // Check if the "prevLocation" exists in localStorage
          const prevLocation = localStorage.getItem("prevLocation");
          if (prevLocation) {
            // Navigate to "/checkout" if "prevLocation" exists
            navigate("/checkout");
            localStorage.removeItem("prevLocation");
          } else {
            // Navigate to "/" if "prevLocation" doesn't exist
            navigate("/");
          }
        } else {
          alert("Login failed. Please check your email or password.");
        }
      } catch (error) {
        console.log(error);
      }
    },

    validateOnChange: false,

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required")
        .min(6, "A minimum of 6 characters is required"),
    }),
  });

  //Login con Google
  const handleSubmitGoogle = async () => {
    try {
      // Authenticate the user with Google
      let res = await loginWithGoogle();

      if (res.user) {
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid);
        const userDoc = await getDoc(userRef);
        let finallyUser;
        // Check if the user already exists in the database
        if (userDoc.exists()) {
          // User exists, retrieve their data
          finallyUser = {
            email: res.user.email,
            rol: userDoc.data().rol,
          };
        } else {
          // User doesn't exist, create a new user role
          await setDoc(userRef, { rol: "user" }, { merge: true });
          finallyUser = {
            email: res.user.email,
            rol: "user",
          };
        }
        // Log in the user and navigate
        handleLogin(finallyUser);
        const prevLocation = localStorage.getItem("prevLocation");
        if (prevLocation) {
          // Navigate to "/checkout" if "prevLocation" exists
          navigate("/checkout");
          localStorage.removeItem("prevLocation");
        } else {
          // Navigate to "/" if "prevLocation" doesn't exist
          navigate("/");
        }
      }
    } catch (error) {
      // Handle any authentication or database errors
      console.error("Error during Google login:", error);
    }
  };

  return (
    <LoginWrapper>
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
                helpertext={errors.email}
                error={errors.email ? true : false}
              />
            </Grid>
            <Grid item xs={10} md={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  name="password"
                  onChange={handleChange}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
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
            <Link
              to="/forgot-password"
              style={{ color: "steelblue", marginTop: "10px" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Grid container justifyContent="center" spacing={3} mt={2}>
              <Grid item xs={10} md={5}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Ingresar
                </Button>
              </Grid>
              <Grid item xs={10} md={5}>
                <Tooltip title="ingresa con google">
                  <Button
                    onClick={handleSubmitGoogle}
                    variant="contained"
                    startIcon={<GoogleIcon />}
                    type="button"
                    fullWidth
                    sx={{
                      color: "white",
                      textTransform: "none",
                      textShadow: "2px 2px 2px grey",
                    }}
                  >
                    Ingresa con google
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={10} md={8}>
                <Typography
                  color={"secondary.primary"}
                  variant={"h6"}
                  mt={1}
                  align="center"
                >
                  ¿Aun no tienes cuenta?
                </Typography>
              </Grid>
              <Grid item xs={10} md={5}>
                <Tooltip title="ingresa con google">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/signup")}
                    type="button"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      textShadow: "2px 2px 2px grey",
                    }}
                  >
                    Registrate
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </LoginWrapper>
  );
};
const LoginWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

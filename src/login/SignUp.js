import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../constants";
import * as client from "../client";
import NotificationSnackbar from "../reusable/NotificationSnackbar";
import Footer from "../home/Footer";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userObj = {
      username: data.get("username"),
      password: data.get("password"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };

    if (
      userObj.username.trim().length === 0 ||
      userObj.password.trim().length === 0 ||
      userObj.firstName.trim().length === 0 ||
      userObj.lastName.trim().length === 0
    ) {
      setTimeout(() => {
        setError(true);
        setErrorMessage("please fill out all of the fields.");
        setLoading(false);
        return;
      }, 700);
    }

    try {
      setError(false);
      setLoading(true);
      var user = null;
      const userData = await client.getUserDataByUserId(user._id);
      client.storeCurrentUser({ ...userData });
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        if (error.response) {
          setLoading(false);
          setError(true);
          setErrorMessage(error.response.data.message);
        }
      }, 700);
    }
  };

  useEffect(() => {
    document.title = "sign up | " + APP_NAME;
    if (client.getCurrentUser()) {
      navigate("/");
    }
  }, []);

  return (
    <Box sx={{ width: "100vw" }}>
      <Container component="main" maxWidth="xs">
        <NotificationSnackbar
          open={success}
          setOpen={setSuccess}
          message="signed up successfully! redirecting..."
          severity="success"
          autoHideDuration={6000}
        />
        <NotificationSnackbar
          open={error}
          setOpen={setError}
          message={errorMessage.toLowerCase()}
          severity="error"
          autoHideDuration={6000}
        />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockOpenIcon
            color="primary"
            sx={{ marginBottom: 2, fontSize: 40 }}
          />
          <Typography variant="h3" textAlign="center">
            sign up for {APP_NAME}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="first name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="last name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                sign up
              </LoadingButton>
              <Link href="/signin" variant="h5">
                {"already have an account? sign in"}
              </Link>
              <Link href="/" variant="h5">
                {"back to home"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

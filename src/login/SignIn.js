import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
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
import { PasswordField } from "./PasswordField";

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(false);
    setLoading(true);
    try {
      await signIn(data);
    } catch (error) {
      // TODO: handle error with snackbar
      setTimeout(() => {
        if (error.response) {
          setLoading(false);
          setError(true);
          setErrorMessage(error.response.data.message);
        }
      }, 500);
    }
  };

  const signIn = async (data) => {
    const user = await client.signIn({
      username: data.get("username"),
      password: data.get("password"),
    });
    const userData = await client.getUserDataByUserId(user._id);
    client.storeCurrentUser({ ...userData });
    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  useEffect(() => {
    document.title = "sign in | " + APP_NAME;
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
          message="signed in successfully! redirecting..."
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
            sign in to {APP_NAME}
          </Typography>
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
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <PasswordField register={false} />
            <LoadingButton
              loading={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              sign in
            </LoadingButton>
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link href="/signup" variant="h5">
                {"don't have an account? sign up"}
              </Link>
              <Link href="/" variant="h5">
                {"back to home"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer></Footer>
    </Box>
  );
}
